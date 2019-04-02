var express = require('express');
var router = express.Router();
var uuidv1 = require('uuid/v1');
var colors = require('colors');

var multer = require("multer");

var upload = multer({
  dest: "./public/images/"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

// insert new product form action
router.post('/insert', upload.single('file'), function(req, res) {
    var db = req.app.db;
    var doc = {
        productFileName: req.file.filename,
        productTitle: req.body.title,
        productPrice: req.body.price,
        productStock: req.body.stock ? parseInt(req.body.stock) : 0
    };
    var stock = req.body.stock ? parseInt(req.body.stock) : 0;
    var query = "Insert into products (id, productFileName, productTitle, productPrice, productStock) VALUES ('" + uuidv1() + "','" +
    			req.file.filename + "','" + req.body.title + "','" + req.body.price + "'," + stock + ")";
    db.execute(query, function(err, newDoc) {
        if(err) {
            console.log(colors.red('Error inserting document: ' + err));
            res.redirect('/');
        } else {
        	db.execute('commit');
        	console.log('Succesfully added product');
            res.redirect('/');

        }
    });
});

module.exports = router;
