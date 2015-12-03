var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var config = require('./config');
var session = require('express-session');
var passport = require('passport');
var routes = require('./lib/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());// for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));// for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your secret here',
    name: 'cfs.connect.sid',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
//登录认证
app.use(passport.initialize());
app.use(passport.session());
//初始化session
app.use(function (req, res, next)
{
    if (req.session)
        req.session.cfs = req.session.cfs || {};
    next();
});

//全局环境变量
var viewGlobalVariablesMiddleware = require('./lib/middleware/view_global_variables');
app.use(viewGlobalVariablesMiddleware);

//log
log4js.configure(config.LOG4JS);

//Routes
routes(app);

module.exports = app;
