'use strict';

var util = require('util');
var http = require('http');

var log = require('log4js').getLogger('error');

//获取错误信息
module.exports.getMeanError = function (error)
{
    //如果传进来的错误信息是文字
    if (typeof error === 'string')
        error = new Error(error);
    
    var status = (function ()
    {
        //获取错误状态
        var _status = error.status || 500;
        //解析处理非法数据
        var _parsed = parseInt(_status, 10);
        if (isNaN(_parsed) || !(600 > _parsed && 200 <= _parsed))
            return 500;
        return _parsed;
    })();

    var code = (function ()
    {
        var _code = error.code || 500;
        var _parsed = parseInt(_code, 10);
        if (isNaN(_parsed)) return 500;
        return _parsed;
    })();

    var meanError = {
        status: status,
        statusDesc: http.STATUS_CODES[status],
        code: code,
        message: error.message,
        stack: error.stack
    };
    return meanError;
};

//打印错误
module.exports.dump = function (error)
{
    if (typeof error !== 'object')
        return log.error('dumpError: argument is not an object');

    if (error.message)
        log.error('%s: %s', error.name ? error.name : 'ERROR', error.message);

    if (error.status && error.code)
        log.error('Status: %s %s, Code: %s', error.status, http.STATUS_CODES[error.status], error.code);

    if (error.stack)
        log.error('Stacktrace: \n' + error.stack);
};

//生成自定义错误信息
module.exports.generate = function (httpStatus, errorCode, message)
{
    var params = [message];
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0, l = args.length; i < l; i++) 
    {
        if (!util.isArray(args[i]))
            params.push(args[i]);
        else
            params = params.concat(args[i]);
    }

    var error = new Error(util.format.apply(util, params));
    error.stack = error.stack.split(/\n/g).splice(2).join('\n');
    error.status = httpStatus;
    error.statusDesc = http.STATUS_CODES[httpStatus];
    error.code = errorCode;
    error.message = message;
    return error;
};

//错误信息集合
module.exports.errors = {
    tag: require('../tag/error'), //101XX
    user: require('../user/error'), //102XX
    ad: require('../ad/error'), //103XX
    link: require('../link/error'), //104XX
    content: require('../content/error'), //105XX
    message: require('../message/error'), //106XX
    category: require('../category/error'), //107XX
    comment: require('../comment/error'), //108XX
};