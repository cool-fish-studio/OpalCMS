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
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;

    var queryOptions = helper.getFromReq(req.query, config.LIMIT.CONTENTS_DEFAULT);
    if (undefined !== req.params.type)
        queryOptions.type = req.params.type;
    contentManager.findAllPaginated(
        queryOptions,
        function (error, paginatedContents)
    {
        if (error) return next(error);
        context.contents = paginatedContents;
        res.render('admin/content/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    var type = req.params.type;
    if (!type)
        return next(errors.content.not.type);
    var context = res.locals.context;

    async.parallel({
        categorys: categoryManager.findAllPaginated.bind(),
        tags: tagManager.findAllPaginated.bind()
    }, function (error, args)
    {
        if (error) return next(error);
        context.categorys = args.categorys;
        context.tags = args.tags;
        context.type = type;
        res.render('admin/content/create');
    });
};
//创建标签
module.exports.applyCreate = function (req, res, next)
{
    var type = req.params.type;
    if (!type)
        return next(errors.content.not.type);

    fileManager.upload(req, res, function (error, fields)
    {
        var title = helper.html2Escape((fields.title || '').trim());
        var category = fields.category || '';
        var tag = (fields.tag || '').split(',');
        var keywords = helper.html2Escape((fields.keywords || '').trim());
        var discription = helper.html2Escape((fields.discription || '').trim());
        var content = (fields.content || '').trim();
        var themesImage = helper.html2Escape((fields.themesImage || '').trim().replace('./public', ''));
        //插件作品
        var repositoryPath = helper.html2Escape((fields.repositoryPath || '').trim());
        var downPath = helper.html2Escape((fields.downPath || '').trim());
        var previewPath = helper.html2Escape((fields.previewPath || '').trim());

        if (!title || !category || !tag.length || !keywords || !discription || !content || !themesImage)
            return next(errors.content.parameter.deficiency);
    
        var contentFields = {
            title: title,
            category: category,
            tags: tag,
            keywords: keywords,
            discription: discription,
            content: content,
            themesImage: themesImage,
            type: type,
            createdByID: req.user.id,
            repositoryPath: repositoryPath,
            downPath: downPath,
            previewPath: previewPath
        };
        contentManager.insert(contentFields, function (error, content)
        {
            if (error) return next(error);
            res.redirect('/admin/content');
        });
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;

    var type = req.params.type;
    if (!type)
        return next(errors.content.not.type);

    contentManager.getByID(
        req.params.contentID, 
        function (error, content)
    {
        if (error) return next(error);
        if (!content) return next(errors.content.not.found);
        context.content = content;

        async.parallel({
            categorys: categoryManager.findAllPaginated.bind(),
            tags: tagManager.findAllPaginated.bind()
        }, function (error, args)
        {
            if (error) return next(error);
            context.categorys = args.categorys;
            context.tags = args.tags;
            context.type = type;
            res.render('admin/content/remove');
        });
    }); 
};
//删除标签
module.exports.applyRemove = function (req, res, next)
{
    var type = req.params.type;
    if (!type)
        return next(errors.content.not.type);

    contentManager.getByID(
        req.params.contentID, 
        function (error, content)
    {
        if (error) return next(error);
        if (!content) return next(errors.content.not.found);

        contentManager.remove(content, function (error, content)
        {
            if (error) return next(error);
            res.redirect('/admin/content');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;

    var type = req.params.type;
    if (!type)
        return next(errors.content.not.type);

    contentManager.getByID(
        req.params.contentID, 
        function (error, content)
    {
        if (error) return next(error);
        if (!content) return next(errors.content.not.found);
        context.content = content;

        async.parallel({
            categorys: categoryManager.findAllPaginated.bind(),
            tags: tagManager.findAllPaginated.bind()
        }, function (error, args)
        {
            if (error) return next(error);
            context.categorys = args.categorys;
            context.tags = args.tags;
            context.type = type;
            res.render('admin/content/update');
        });
    });  
};
//修改标签
module.exports.applyUpdate = function (req, res, next)
{
    var type = req.params.type;
    if (!type)
        return next(errors.content.not.type);

    fileManager.upload(req, res, function (error, fields)
    {
        var title = helper.html2Escape((fields.title || '').trim());
        var category = fields.category || '';
        var tag = (fields.tag || '').split(',');
        var keywords = helper.html2Escape((fields.keywords || '').trim());
        var discription = helper.html2Escape((fields.discription || '').trim());
        var content = (fields.content || '').trim();
        var themesImage = helper.html2Escape((fields.themesImage || '').trim().replace('./public', ''));
        //插件作品
        var repositoryPath = helper.html2Escape((fields.repositoryPath || '').trim());
        var downPath = helper.html2Escape((fields.downPath || '').trim());
        var previewPath = helper.html2Escape((fields.previewPath || '').trim());
    
        var contentFields = {};
        if (title) contentFields.title = title;
        if (category) contentFields.category = category;
        if (tag.length) contentFields.tags = tag;
        if (discription) contentFields.discription = discription;
        if (content) contentFields.content = content;
        if (themesImage) contentFields.themesImage = themesImage;
        if (repositoryPath) contentFields.repositoryPath = repositoryPath;
        if (downPath) contentFields.downPath = downPath;
        if (previewPath) contentFields.previewPath = previewPath;

        contentManager.getByID(
            req.params.contentID, 
            function (error, content)
        {
            if (error) return next(error);
            if (!content) return next(errors.content.not.found);

            contentManager.update(content, contentFields, function (error, content)
            {
                if (error) return next(error);
                res.redirect('/admin/content');
            });
        }); 
    });
};
