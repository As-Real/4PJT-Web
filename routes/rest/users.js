var express = require('express');
var path = require('path');
var router = express.Router();
var config = require('config');
var mysql = require('mysql');
var passport = require('passport');
var bcrypt = require('bcrypt');
var storageConfig = config.get('storage');
var fs = require('fs');

//Base route : /api/users

router.get('/', passport.authenticate('basic', { session: false }),function(req, res, next) {
    var query = 'SELECT * FROM user;';

    checkIfAdmin(req.user.username, req.user.password, function(isValidatedAdmin){
        if(isValidatedAdmin){
            con.query(query, function(err, data){
                if(err){
                    res.status(err.statusCode || 500).json(err);
                    return;
                }
                res.json(data);
            })
        }
        else{
            res.sendStatus(401)
        }
    });
});

router.get('/:id', passport.authenticate('basic', { session: false }),function(req, res, next) {

    checkIfAdmin(req.user.username, req.user.password, function (isValidatedAdmin) {
        if (isValidatedAdmin) {
            var id = req.params.id;
            if (!id) {
                res.status(err.statusCode || 500).json('Paramètre manquant');
                return;
            }

            var query = 'SELECT * FROM user WHERE id = ?;';
            var inserts = [id];
            query = mysql.format(query, inserts);

            con.query(query, function (err, data) {
                if (err) {
                    res.status(err.statusCode || 500).json(err);
                    return;
                }
                res.json(data);
            })
        }
        else {
            res.sendStatus(401)
        }
    });
});

router.post('/auth', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;


    if(!username || ! password){
        res.status(400).json('Paramètre manquant');
        return;
    }

    var query = 'SELECT * FROM user WHERE ?? = ?;';
    var inserts = ['username', username];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
            return;
        }
        if(data && data.length && data !== undefined) {
            if(data.length > 1){
                res.status(500).json("Une erreur est survenue")
            }
            else{
                if(bcrypt.compareSync(password, data[0].password)){
                    res.status(200).json(data[0].id);
                } else {
                    res.sendStatus(401)
                }
            }
        }
        else{
            res.sendStatus(401)
        }
    })
});

router.post('/', function(req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    if(!name || !username || ! password){
        res.status(400).json('Paramètre manquant');
        return;
    }

    var hash = bcrypt.hashSync(password, 6);
    if(hash){
        var query = 'INSERT INTO user (??, ??, ??) VALUES (?, ?, ?);';
        var inserts = ['name', 'username', 'password', name, username, hash];
        query = mysql.format(query, inserts);

        con.query(query, function (err, data) {
            if (err) {
                res.status(err.statusCode || 500).json(err);
                return;
            }

            var prefixPath = storageConfig.path + '/' + data.insertId;

            fs.mkdir(prefixPath, function(err) {
                if(err){
                    res.status(err.statusCode || 500).json(err);
                    res.end();
                }else{
                    fs.mkdir(prefixPath + '/' + "root", function(err) {
                        if(err){
                            res.status(err.statusCode || 500).json(err);
                            res.end();
                        }else{
                            res.sendStatus(201);
                        }
                    });
                    }
            });
            })
    }else{
        res.sendStatus(500);
    }
});


router.delete('/:id', passport.authenticate('basic', { session: false }),function(req, res, next) {

    checkIfAdmin(req.user.username, req.user.password, function (isValidatedAdmin) {
        if (isValidatedAdmin) {
            var id = req.params.id;
            if (!id) {
                res.status(400).json('Paramètre manquant');
                return;
            }
            var query = 'DELETE FROM user WHERE id = ?;';
            var inserts = [id];
            query = mysql.format(query, inserts);

            con.query(query, function (err, data) {
                if (err) {
                    res.status(err.statusCode || 500).json(err);
                    return;
                }
                res.sendStatus(200);
            })
        }
        else {
            res.sendStatus(401)
        }
    });
});


router.put('/:id', passport.authenticate('basic', { session: false }),function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    if(!id){
        res.status(400).json('Paramètre manquant');
        return;
    }
    if(!name || !username || ! password){
        res.status(400).json('Paramètre manquant');
        return;
    }
    checkIfAdmin(req.user.username, req.user.password, function (isValidatedAdmin) {
        if(!isValidatedAdmin && id != req.user.id){
            accessDenied = true;
            res.sendStatus(401);
        }
        else{
            var hash = bcrypt.hashSync(password, 6);
            if(hash){
                var query = 'UPDATE user  SET ?? = ? , ?? = ?, ?? = ? WHERE id = ?;';
                var inserts = ['name', name, 'username', username, 'password', hash, id];
                query = mysql.format(query, inserts);

                con.query(query, function(err, data){
                    if(err){
                        res.status(err.statusCode || 500).json(err);
                        return;
                    }
                    res.sendStatus(200);
                })
            }else{
                res.sendStatus(500);
            }
        }
    });
});



function checkIfAdmin(username, password, callback) {

    var query = 'SELECT * FROM user WHERE ?? = ?;';
    var inserts = ['username', username];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            callback(false);
            return
        }
        if(data && data.length && data !== undefined) {
            if(data.length > 1){
                callback(false);
            }
            else{
                if(bcrypt.compareSync(password, data[0].password)) {
                    var isAdmin = data[0].isAdmin === 1;
                    callback(isAdmin);
                }
            }
        }
        else{
            callback(false);
        }
    })
}


module.exports = router;