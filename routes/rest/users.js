var express = require('express');
var path = require('path');
var router = express.Router();
var config = require('config');
var mysql = require('mysql');
var passport = require('passport');

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
                console.log(data);
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
                res.status(err.statusCode || 500).json('Missing mandatory parameter');
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
                console.log(data);
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

    var query = 'SELECT * FROM user WHERE ?? = ? AND ?? = ?;';
    var inserts = ['username', username, 'password', password];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
            return;
        }
        console.log(data);
        if(data && data.length && data !== undefined) {
            if(data.length > 1){
                res.status(500).json("Two users match these credentials. This should NEVER happen")
            }
            else{
                res.status(200).json(data[0].id);
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
        res.status(400).json('Missing mandatory parameter');
        return;
    }

    var query = 'INSERT INTO user (??, ??, ??) VALUES (?, ?, ?);';
    var inserts = ['name', 'username', 'password', name, username, password];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
            return;
        }
        console.log(data);
        res.sendStatus(201);
    })
});


router.delete('/:id', passport.authenticate('basic', { session: false }),function(req, res, next) {

    checkIfAdmin(req.user.username, req.user.password, function (isValidatedAdmin) {
        if (isValidatedAdmin) {

            var id = req.params.id;

            if (!id) {
                res.status(400).json('Missing mandatory parameter');
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
                console.log(data);
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
        res.status(400).json('Missing mandatory parameter');
        return;
    }
    if(!name || !username || ! password){
        res.status(400).json('Missing mandatory parameter');
        return;
    }

    var query = 'UPDATE user  SET ?? = ? , ?? = ?, ?? = ? WHERE id = ?;';
    var inserts = ['name', name, 'username', username, 'password', password, id];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
            return;
        }
        console.log(data);
        res.sendStatus(200);
    })
});



function checkIfAdmin(username, password, callback) {

    var query = 'SELECT * FROM user WHERE ?? = ? AND ?? = ?;';
    var inserts = ['username', username, 'password', password];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            callback(false);
            return
        }
        console.log(data);
        if(data && data.length && data !== undefined) {
            if(data.length > 1){
                callback(false);
            }
            else{
                var isAdmin = data[0].isAdmin === 1;
                callback(isAdmin);
            }
        }
        else{
            callback(false);
        }
    })
}


module.exports = router;