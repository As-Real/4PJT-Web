var express = require('express');
var pathHelper = require('path');
var router = express.Router();
var config = require('config');
var storageConfig = config.get('storage');
var fs = require('fs');
var passport = require('passport');

//Base route : /api/folders

router.post('/add', passport.authenticate('basic', { session: false }),function(req, res, next) {
    var id = req.user.id;
    var path = req.body.path;
    var folderName = req.body.folderName;


    if(!path){
        res.status(400).json('Missing path');
        return;
    }
    if(!id){
        res.status(400).json('Missing user id');
        return;
    }
    if(!folderName){
        res.status(400).json('Missing folder name');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Given id does not match any user id');
        return;
    }
    var pathToGet = prefixPath + path;

    var folder = pathToGet + folderName;

    if(!folder){
        res.status(400).json('Missing folder name');
        return;
    }

    fs.mkdir(folder, function(err) {
        if(err){
            res.status(err.statusCode || 500).json(err);
            res.end();
        }else{
            res.sendStatus(201);
        }
    });
});


module.exports = router;