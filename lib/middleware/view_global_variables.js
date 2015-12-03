'use strict';

var async = require('async');
var url = require('url');

var config = require('../../config');
var viewHelper = require('../util/viewHelper');

var log = require('log4js').getLogger('viewGlobalVariablesMiddleware');

module.exports = function (req, res, next)
{
    log.info('开始全局变量加载');
    res.locals.context = {};
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.session = req.session.cfs;
    res.locals.viewHelper = viewHelper;
    res.locals.SITENAME = config.SITENAME;
    log.info('完成全局变量加载');
    next();
};