var express = require('express');
var pathHelper = require('path');
var router = express.Router();
var config = require('config');
var storageConfig = config.get('storage');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({});

//Base route : /api/files

router.post('/download',  function(req,res,next){

    var id = req.body.id;
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

    res.download(pathToGet);
});

router.get('/download',  function(req,res,next){

    var id = req.query.id;
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

    res.download(pathToGet);
});



router.post('/upload', upload.single('incoming'), function(req,res,next){

    var id = req.body.id;
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

    var buffer = req.file.buffer;

    var fileDescriptor;
    try {
        fileDescriptor = fs.openSync(pathToGet + req.file.originalname , 'w');
    } catch (e) {
        res.sendStatus(500)
    }
    if (fileDescriptor) {
        fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
        fs.closeSync(fileDescriptor);
    }
    res.sendStatus(200);
});

router.get('/list', function(req, res, next) {
    var id = req.query.id;
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


    var result = [];

    fs.readdir(pathToGet, function(err, items) {
        if(err){
            res.status(err.statusCode || 500).json(err);
            res.end();
        }
        else{
            for(var i = 0; i < items.length; i++){
                result.push(formatSingleNode(items[i], path, pathToGet))
            }
            res.status(200).json(result);
        }
    });
});

router.post('/rename', function(req, res, next) {
    var id = req.body.id;
    var path = req.body.path;
    var newPath = req.body.newPath;


    if(!path){
        res.status(400).json('Missing path');
        return;
    }
    if(!newPath){
        res.status(400).json('Missing new path');
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
    var newPathToGet = prefixPath + newPath;

    fs.rename(pathToGet, newPathToGet, function(err) {
        if(err){
            res.status(err.statusCode || 500).json(err);
            res.end();
        }else{
            res.sendStatus(200);
        }
    });
});


function formatSingleNode(node, relPath, absPath){
    var nodeData = {};

    nodeData.name = node;
    nodeData.path = relPath + node;

    if(fs.lstatSync(absPath + node).isDirectory()){
        nodeData.type = "folder";
    }
    else{
        nodeData.type = getType(pathHelper.extname(node))
    }
    return nodeData;
}

function getType(extension){
    if(storageConfig.types.hasOwnProperty(extension))
    {
        return storageConfig.types[extension];
    }
    return "unknown";
}
module.exports = router;