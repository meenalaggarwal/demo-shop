var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res, next)  {
	request.get({
		headers: { 'content-type' : 'application/json', 'Accept': 'application/json' },
		url:  config.url + '/v1/',
	},function(error, response, body) {
		var obj = JSON.parse(body).data;
		if (response.statusCode === 200) {
			res.render('products', {
                title: 'Express-Shop',
                results: obj.data,
                totalProductCount: obj.totalProducts
            });
		} else {
			return res.redirect('/');
		}
	});
});

module.exports = router;