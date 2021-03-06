var express = require('express');
var config = require('./config');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');

var Register = require('./routes/Register');
var home = require('./routes/home');
var postPhoto = require('./routes/postPhoto');

var app = express();

mongoose.connect('mongodb://zeekw:Kinnock2016@ds011298.mlab.com:11298/sneakysnapposts');

app.use(stormpath.init(app, {
  web: {
    register: {
      fields: {
        username: {
          enabled: true,
          label: 'Username',
          name: 'username',
          placeholder: 'Username',
          required: true,
          type: 'text'
        }
      }
    },
    login: {
      enabled: true,
      nextUri: "/"
    }
  },
  client: {
    apiKey: {
      file: 'apiKey.properties'
    }
  },
  application: {
    href: 'https://api.stormpath.com/v1/applications/YaqUfgYSVHo3s8CBRQdTW'
  },
  website: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/NewAccount', Register);
app.use('/', home);
app.use('/postPhoto', postPhoto);


// catch 404 and forward to error handler
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

//var server = app.listen(3000, function () {
//  var host = server.address().address;
//  var port = server.address().port;
//
//  console.log('Example app listening at http://%s:%s', host, port);
//});

app.on('stormpath.ready', function() {
  app.listen(3000);
  console.log("Running at localhost:3000");
});

module.exports = app;
