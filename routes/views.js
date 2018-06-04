var express = require('express');
var path = require('path');
var router = express.Router();

router.all("/front/*", function (req, res) {
	res.sendFile('layout.html', {root: path.resolve(__dirname, '..', 'views')});
});

router.all("/anon/*", function (req, res) {
	res.sendFile('layoutAnonymous.html', {root: path.resolve(__dirname, '..', 'views')});
});

router.get("/", function (req, res) {
	res.redirect('/front/')
});

module.exports = router;
