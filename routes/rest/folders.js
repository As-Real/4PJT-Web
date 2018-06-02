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
        res.status(400).json('Chemin de destination manquant');
        return;
    }
    if(!folderName){
        res.status(400).json('Nom du dossier manquant');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Le dossier personnel de l\'utilistateur n\'exsite pas');
        return;
    }
    var pathToGet = prefixPath + path;

    var folder = pathToGet + folderName;

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
        res.status(400).json('Chemin du dossier manquant');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Le dossier personnel de l\'utilistateur n\'exsite pas');
        return;
    }
    var pathToGet = prefixPath + path;

    if(!fs.lstatSync(pathToGet).isDirectory()){
        res.status(400).json('Le chemin n\'est pas valide ou n\'est pas un dossier');
        return;
    }


    fs.rmdir(pathToGet, function(err) {
        if(err){
            if(err.code === "ENOTEMPTY"){
                res.status(err.statusCode || 500).json("Le dossier à supprimer n'est pas vide");
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
        res.status(400).json('Chemin du dossier manquant');
        return;
    }

    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Le dossier personnel de l\'utilistateur n\'exsite pas');
        return;
    }

    var pathToGet = prefixPath + path;
    if(!fs.lstatSync(pathToGet).isDirectory()){
        res.status(400).json('Le chemin n\'est pas valide ou n\'est pas un dossier');
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
        res.status(400).json('Chemin do dossier manquant');
        return;
    }
    var prefixPath = storageConfig.path + '/' + id;

    if (!fs.existsSync(prefixPath)) {
        res.status(400).json('Le dossier personnel de l\'utilistateur n\'exsite pas');
        return;
    }

    var pathToGet = prefixPath + path;
    if(!fs.lstatSync(pathToGet).isDirectory()){
        res.status(400).json('Le chemin n\'est pas valide ou n\'est pas un dossier');
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