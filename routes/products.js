var express = require('express');
var router = express.Router();

var multer = require("multer");

var upload = multer({
  dest: "./uploads/"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

// insert new product form action
router.post('/insert', upload.single('file'), function(req, res) {
    var db = req.app.db;

    var doc = {
        productFileName: req.file.filename,
        productTitle: req.body.title,
        productPrice: req.body.price,
        productAddedDate: new Date(),
        productStock: req.body.stock ? parseInt(req.body.stock) : null
    };
    db.products.insertOne(doc, function(err, newDoc) {
        if(err) {
            console.log(colors.red('Error inserting document: ' + err));
            res.redirect('/');
        } else {
        	console.log('Succesfully added product');
            res.redirect('/');
        }
    });
});

module.exports = router;
