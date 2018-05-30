var express = require('express');
var pathHelper = require('path');
var router = express.Router();
var config = require('config');
var storageConfig = config.get('storage');
var fs = require('fs');
var passport = require('passport');
const AdmZip = require('adm-zip');

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

router.post('/remove', passport.authenticate('basic', { session: false }),function(req, res, next) {
    var id = req.user.id;
    var path = req.body.path;

    if(!path){
        res.status(400).json('Missing path');
        return;
    }
    if(!id){
        res.status(400).json('Missing user id');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Given id does not match any user id');
        return;
    }
    var pathToGet = prefixPath + path;

    if(!fs.lstatSync(pathToGet).isDirectory()){
        res.status(400).json('Path is not valid or is not a directory');
        return;
    }


    fs.rmdir(pathToGet, function(err) {
        if(err){
            if(err.code === "ENOTEMPTY"){
                res.status(err.statusCode || 500).json("The directory you're trying to delete is not empty");
                res.end();
            }else{
                res.status(err.statusCode || 500).json(err);
                res.end();
            }
        }else{
            res.sendStatus(200);
        }
    });
});

router.post('/download', passport.authenticate('basic', { session: false }), function(req,res,next){

    var id = req.user.id;
    var path = req.body.path;

    if(!path){
        res.status(400).json('Missing path');
        return;
    }
    if(!id){
        res.status(400).json('Missing user id');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Given id does not match any user id');
        return;
    }

    var pathToGet = prefixPath + path;
    if(!fs.lstatSync(pathToGet).isDirectory()){
        res.status(400).json('Path is not valid or is not a directory');
        return;
    }


    const zip = new AdmZip();
    zip.addLocalFolder(pathToGet);

    var date = new Date();
    var title  = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

    var zipPath = __root  + '/temp/'+title+'.zip';
    zip.writeZip(zipPath);


    res.download(zipPath);

    setTimeout(
        function(){
            fs.unlink(zipPath)
        }, 15000
    );


});

router.get('/download', passport.authenticate('basic', { session: false }),  function(req,res,next){

    var id = req.user.id;
    var path = req.query.path;

    if(!path){
        res.status(400).json('Missing path');
        return;
    }
    if(!id){
        res.status(400).json('Missing user id');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Given id does not match any user id');
        return;
    }

    var pathToGet = prefixPath + path;
    if(!fs.lstatSync(pathToGet).isDirectory()){
        res.status(400).json('Path is not valid or is not a directory');
        return;
    }
    const zip = new AdmZip();
    zip.addLocalFolder(pathToGet);

    var date = new Date();
    var title  = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

    var zipPath = __root  + '/temp/'+title+'.zip';
    zip.writeZip(zipPath);


    res.download(zipPath);

    setTimeout(
        function(){
            fs.unlink(zipPath)
        }, 15000
    );
});

module.exports = router;