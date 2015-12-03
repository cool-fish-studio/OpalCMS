'use strict';

var config = require('../../config');
var errorHelper = require('./error');

var authMiddleware = require('../middleware/auth');

var log = require('log4js').getLogger('errorHandler');

//检测错误
var errorHandler = function (error, req, res, next)
{
    var meanError = errorHelper.getMeanError(error);
    errorHelper.dump(meanError);
    if (config.nodeEnv !== 'development' && config.nodeEnv !== 'testing')
        delete meanError.stack;
    res.status(meanError.status);

    if (/^\/admin/.test(req.url) && req.user && req.user.role == 'admin')
        return res.render('admin/error', { error: meanError } );
    res.render('error', { error: meanError } );
    // res.json(meanError);
};

module.exports.errorHandler = errorHandler;

//404
module.exports.handler404 = function (req, res, next)
{
    var error = new Error('Not Found');
    error.status = 404;
    error.code = 404;
    next(error);
};
//listen the uncaughtException event
process.on('uncaughtException', function(error)
{
    log.error('uncaughtException ERROR');
    errorHelper.dump(error);
});