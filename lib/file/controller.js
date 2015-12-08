'use strict';

var fs = require('fs');
var async = require('async');

var contentManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

var tagManager = require('../tag/manager');
var categoryManager = require('../category/manager');
var fileManager = require('../file/manager');

//页面列表
module.exports.applyUpload = function (req, res, next)
{
    var context = res.locals.context;

    fileManager.uploadContent(req, res, function (error, fields)
    {
        if (error) return next(error);
        res.json({
            message: 'uploadSuccess',
            file: fields.fileToUpload.replace('./public', '')
        });
    });
};