var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');

var index = require('./routes/index');
var users = require('./routes/users');
var download= require('./routes/download');

global.appRoot = path.resolve(__dirname);

var app = express();
app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

Auth = function(username, password) {
  return function(req, res, next) {
    var user = basicAuth(req);

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }

    next();
  };
};


app.use('/listvideos', Auth('luzb', 'Hz123456'));
var listvideos = require('./routes/list');
app.use('/listvideos', listvideos);


app.use('/', index);
app.use('/users', users);
app.use('/download', download);
app.use('/public', express.static('public'))
app.use('/play/:fname', function (req, res, next) {
   var fname = req.params.fname;
   if(fname)
    res.render('play', {fname: req.params.fname, title:fname.substring(0, fname.lastIndexOf('.')) });
   else {
     var err = new Error('No Such Resource')
     err.status = 404;
     next(err);
   }
});

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
  res.locals.error = req.app.get('env') === 'development'? {}:{} ;  // err : {};
  console.log(JSON.stringify(err));
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(80)
module.exports = app;
