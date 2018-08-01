/*
For bhavalan


1 - create a page Ex:student.ejs
2 - define in app.js Ex:  app.get('/qstn', users.qstn);
3 - create a router, see users.js file has qstn method

*/

// create user - login page - 
// welcome page (student/admin)
// add/edit/delete qstn 
// write test

// this line added from studentofprogramming - testing git commit from another user

// adding this line for mogan


var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.session({secret: 'subaara'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

var auth = require('./middleware/auth');
app.all('*', auth.autenticate);

var routes = require('./routes')(app);
var users = require('./routes/user')(app);
var admin = require('./routes/admin')(app);
var question = require('./routes/question')(app);
var question = require('./routes/fn')(app);





/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
