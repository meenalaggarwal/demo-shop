var express = require('express');
var router = express.Router();
var colors = require('colors');
var common = require('../common');
var async = require('async');

/* GET home page. */
// The main entry point of the shop

router.get('/v1', function(req, res, next)  {
    var db = req.app.db;
    common.getProducts(req)
    .then(function(results) {
        return res.status(200).send({data: results});
    })
    .catch(function(err) {
        console.error(colors.red('Error getting products for page', err));
        return res.status(400).send();
    });
});

module.exports = router;
