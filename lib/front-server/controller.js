'use strict';

var fs = require('fs');
var async = require('async');


var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

var contentManager = require('../content/manager');
var tagManager = require('../tag/manager');
var categoryManager = require('../category/manager');
var fileManager = require('../file/manager');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;

    context.menu = 'index';
    context.isShowBanner = true;

    var queryOptions = helper.getFromReq(req.query, config.LIMIT.CONTENTS_DEFAULT);
    if (undefined !== req.params.type)
    {
        queryOptions.type = req.params.type;
        context.menu = req.params.type;
        context.isShowBanner = true;
    }

    contentManager.findAllPaginated(
        queryOptions,
        function (error, paginatedContents)
    {
        if (error) return next(error);
        context.contents = paginatedContents;
        res.render('list');
    }); 
};
module.exports.viewInfo = function (req, res, next)
{
    var context = res.locals.context;

    context.menu = req.params.type;
    context.isShowBanner = false;

    contentManager.getByID(
        req.params.contentID,
        function (error, content)
    {
        if (error) return next(error);
        context.content = content;
        
        categoryManager.findAll(
            function (error, categorys)
        {
            if (error) return next(error);
            context.categorys = categorys;
            res.render('article');
        }); 
    }); 

};
