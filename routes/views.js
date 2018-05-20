var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.all('/users/*', function(req, res){
    res.sendFile('layout.html', {root: path.resolve(__dirname, '..', 'views')});
});

router.all('/files/*', function(req, res){
    res.sendFile('fileLayout.html', {root: path.resolve(__dirname, '..', 'views')});
});

module.exports = router;
