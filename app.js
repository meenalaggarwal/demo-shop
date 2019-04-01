var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient;
var mongodbUri = require('mongodb-uri');
var numeral = require('numeral');
var hbs = require('hbs');
var http = require('http');
var config = require('./config');
var oracledb = require('oracledb');

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

// helpers for the handlebar templating platform
hbs.registerHelper('perRowClass', function(numProducts) {
    if(parseInt(numProducts) === 1){
        return'col-md-12 col-xl-12 col m12 xl12 product-item';
    }
    if(parseInt(numProducts) === 2){
        return'col-md-6 col-xl-6 col m6 xl6 product-item';
    }
    if(parseInt(numProducts) === 3){
        return'col-md-4 col-xl-4 col m4 xl4 product-item';
    }
    if(parseInt(numProducts) === 4){
        return'col-md-3 col-xl-3 col m3 xl3 product-item';
    }

    return'col-md-6 col-xl-6 col m6 xl6 product-item';
});
hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch(operator) {
    case'==':
        return(v1 === v2) ? options.fn(this) : options.inverse(this);
    case'!=':
        return(v1 !== v2) ? options.fn(this) : options.inverse(this);
    case'===':
        return(v1 === v2) ? options.fn(this) : options.inverse(this);
    case'<':
        return(v1 < v2) ? options.fn(this) : options.inverse(this);
    case'<=':
        return(v1 <= v2) ? options.fn(this) : options.inverse(this);
    case'>':
        return(v1 > v2) ? options.fn(this) : options.inverse(this);
    case'>=':
        return(v1 >= v2) ? options.fn(this) : options.inverse(this);
    case'&&':
        return(v1 && v2) ? options.fn(this) : options.inverse(this);
    case'||':
        return(v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
        return options.inverse(this);
    }
  });

hbs.registerHelper('formatAmount', function(amt){
    if(amt){
        return numeral(amt).format('0.00');
    }
    return'0.00';
});

hbs.registerHelper('currencySymbol', function(value){
    if(typeof value === 'undefined' || value === ''){
        return'$';
    }
    return value;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.on('uncaughtException', function(err) {
    console.error(colors.red(err.stack));
    process.exit(2);
});

var connection = oracledb.getConnection({
  user          : "admin",
  password      : "meenal@1992",
  connectString : "adb.eu-frankfurt-1.oraclecloud.com:1522/kkskxbsucyfpat7_demo_medium.atp.oraclecloud.com"
}, function(err, rssult) {
  console.log(err.stack)
  console.log(rssult)
});

console.log(connection)

MongoClient.connect(config.databaseConnectionString, {}, function(err, client) {
    // On connection error we display then exit
  if(err) {
      console.log(colors.red('Error connecting to MongoDB: ' + err));
      process.exit(2);
  }

  // select DB
  var dbUriObj = mongodbUri.parse(config.databaseConnectionString);
  var db;
      db = client.db(dbUriObj.database);

  // setup the collections
  db.products = db.collection('products');

  // add db to app for routes
  app.dbClient = client;
  app.db = db;
  app.config = config;
  var port = normalizePort(process.env.PORT || '3000');
  /*var port = normalizePort('3000');*/

  app.set('port', port);
  app.port = app.get('port');

  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
	/**
   * Event listener for HTTP server "error" event.
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
module.exports = app;