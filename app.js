var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var db = require('./config/db');
require('./config/jwtSecret');

/* DB connection config */
var mongoose = require('mongoose');

var app = express();


/* requiring models */
require('./models/Users');
require('./models/Institutions');
require('./models/Notifications');
require('./models/IpPools');
require('./models/Settings');

/* requiring passport */
require('./config/passport');

/*  route declaration */
var index         = require('./routes/index');
var users         = require('./routes/users');
var institutions  = require('./routes/institutions');
var notifications = require('./routes/notifications');
var ipPools       = require('./routes/ipPools');
var settings      = require('./routes/settings');


/* CONNECTING TO THE DB */
mongoose.connect(db.url);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


/* using routes */
app.use('/', index);
app.use('/api/institutions', institutions);
app.use('/api/users', users);
app.use('/api/notifications', notifications);
app.use('/api/ipPools', ipPools);
app.use('/api/settings', settings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// error handlers
// Catch unauthorised errors
/*
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
*/

module.exports = app;
