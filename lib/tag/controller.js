'use strict';

var tagManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;
    tagManager.findAllPaginated(
        helper.getFromReq(req.query, config.LIMIT.TAGS_DEFAULT),
        function (error, paginatedTags)
    {
        if (error) return next(error);

        context.tags = paginatedTags;
        res.render('admin/tag/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    res.render('admin/tag/create');
};
//创建标签
module.exports.applyCreate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';

    if (!name || !weight)
        return next(errors.tag.parameter.deficiency);

    var tagFields = {
        name: name,
        weight: weight,
        createdByID: req.user.id
    };
    tagManager.insert(tagFields, function (error, tag)
    {
        if (error) return next(error);
        res.redirect('/admin/tag');
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;
    tagManager.getByID(
        req.params.tagID, 
        function (error, tag)
    {
        if (error) return next(error);
        if (!tag) return next(errors.tag.not.found);
        context.tag = tag;
        res.render('admin/tag/remove');
    }); 
};
//删除标签
module.exports.applyRemove = function (req, res, next)
{
    tagManager.getByID(
        req.params.tagID, 
        function (error, tag)
    {
        if (error) return next(error);
        if (!tag) return next(errors.tag.not.found);

        tagManager.remove(tag, function (error, tag)
        {
            if (error) return next(error);
            res.redirect('/admin/tag');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;
    tagManager.getByID(
        req.params.tagID, 
        function (error, tag)
    {
        if (error) return next(error);
        if (!tag) return next(errors.tag.not.found);
        context.tag = tag;
        res.render('admin/tag/update');
    }); 
};
//修改标签
module.exports.applyUpdate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';
    
    if (!name || !weight)
        return next(errors.tag.parameter.deficiency);

    var tagFields = {
        name: name,
        weight: weight
    };

    tagManager.getByID(
        req.params.tagID, 
        function (error, tag)
    {
        if (error) return next(error);
        if (!tag) return next(errors.tag.not.found);

        tagManager.update(tag, tagFields, function (error, tag)
        {
            if (error) return next(error);
            res.redirect('/admin/tag');
        });
    }); 
};
