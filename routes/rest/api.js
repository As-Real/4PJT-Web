var express = require('express');
var path = require('path');
var router = express.Router();
var config = require('config');
var mysql = require('mysql');


router.get('/users', function(req, res, next) {
    var query = 'SELECT * FROM user;';

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
        }
        console.log(data);
        res.json(data);
    })
});


router.post('/users', function(req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    if(!name || !username || ! password){
        res.status(err.statusCode || 500).json('Missing mandatory parameter');
        return;
    }

    var query = 'INSERT INTO user (??, ??, ??) VALUES (?, ?, ?);';
    var inserts = ['name', 'username', 'password', name, username, password];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
        }
        console.log(data);
        res.sendStatus(201);
    })
});


router.delete('/users/:id', function(req, res, next) {
    var id = req.params.id;

    if(!id){
        res.status(err.statusCode || 500).json('Missing mandatory parameter');
        return;
    }

    var query = 'DELETE FROM user WHERE id = ?;';
    var inserts = [id];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
        }
        console.log(data);
        res.sendStatus(200);
    })
});


router.put('/users/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    if(!id){
        res.status(err.statusCode || 500).json('Missing mandatory parameter');
        return;
    }
    if(!name || !username || ! password){
        res.status(err.statusCode || 500).json('Missing mandatory parameter');
        return;
    }

    var query = 'UPDATE user  SET ?? = ? , ?? = ?, ?? = ? WHERE id = ?;';
    var inserts = ['name', name, 'username', username, 'password', password, id];
    query = mysql.format(query, inserts);

    con.query(query, function(err, data){
        if(err){
            res.status(err.statusCode || 500).json(err);
        }
        console.log(data);
        res.sendStatus(200);
    })
});



module.exports = router;