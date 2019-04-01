var express = require('express');
var router = express.Router();
var colors = require('colors');
var common = require('../common');
var fs = require('fs');
var async = require('async');

/* GET home page. */
// The main entry point of the shop

router.get('/:page?', function(req, res, next)  {
    var db = req.app.db;
    var config = req.app.config;
    var numberProducts = config.productsPerPage ? config.productsPerPage : 10;
    var page = 0;
    // if no page is specified, just render page 1 of the cart
    if (!req.params.page) {
        page = 1;
    } else {
        page = req.params.page;
    }
    
    common.getProducts(req, page, {}, config)
    .then(function(results) {
        async.each(results.data, function(prod, callback) {
            fs.readFile('./uploads/' + prod.productFileName, 'utf8', function(err, data) {  
                if (err) console.error(colors.red('Error getting products for page', err));
                prod.buffer = data;
                return callback();
            });
        }, function(err) {
            res.render('products', {
                title: 'Express-Shop',
                results: results.data,
                config: req.app.config,
                productsPerPage: numberProducts,
                totalProductCount: results.totalProducts,
                pageNum: 1,
                paginateUrl: 'page'
            });
        });    
    })
    .catch(function(err) {
        console.log(err)
        console.error(colors.red('Error getting products for page', err));
    });
});

module.exports = router;
