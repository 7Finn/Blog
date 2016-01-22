
/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

// var express = require('express'),
//   routes = require('./routes'),
//   api = require('./routes/api');

// var app = module.exports = express.createServer();

// // Configuration
module.exports = function(db) {

  var routes = require('./routes/index')(db);
  var api = require('./routes/api')(db);
  var app = express();

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', routes);
  app.use('/api', api);

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handlers
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.listen(8000);
  console.log("The server has been started on http://localhost:8000/");

  return app;
}













