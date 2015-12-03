'use strict';

var linkManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;
    linkManager.findAllPaginated(
        helper.getFromReq(req.query, config.LIMIT.LINKS_DEFAULT),
        function (error, paginatedLinks)
    {
        if (error) return next(error);

        context.links = paginatedLinks;
        res.render('admin/link/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    res.render('admin/link/create');
};
//创建标签
module.exports.applyCreate = function (req, res, next)
{
    var name = req.body.name || '';
    var url = req.body.url || '';
    var weight = req.body.weight || '';

    if (!name || !weight || !url)
        return next(errors.link.parameter.deficiency);

    var linkFields = {
        name: name,
        url: url,
        weight: weight,
        createdByID: req.user.id
    };
    linkManager.insert(linkFields, function (error, link)
    {
        if (error) return next(error);
        res.redirect('/admin/link');
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;
    linkManager.getByID(
        req.params.linkID, 
        function (error, link)
    {
        if (error) return next(error);
        if (!link) return next(errors.link.not.found);
        context.link = link;
        res.render('admin/link/remove');
    }); 
};
//删除标签
module.exports.applyRemove = function (req, res, next)
{
    linkManager.getByID(
        req.params.linkID, 
        function (error, link)
    {
        if (error) return next(error);
        if (!link) return next(errors.link.not.found);

        linkManager.remove(link, function (error, link)
        {
            if (error) return next(error);
            res.redirect('/admin/link');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;
    linkManager.getByID(
        req.params.linkID, 
        function (error, link)
    {
        if (error) return next(error);
        if (!link) return next(errors.link.not.found);
        context.link = link;
        res.render('admin/link/update');
    }); 
};
//修改标签
module.exports.applyUpdate = function (req, res, next)
{
    var name = req.body.name || '';
    var url = req.body.url || '';
    var weight = req.body.weight || '';
    
    if (!name || !weight || !url)
        return next(errors.link.parameter.deficiency);

    var linkFields = {
        name: name,
        url: url,
        weight: weight
    };

    linkManager.getByID(
        req.params.linkID, 
        function (error, link)
    {
        if (error) return next(error);
        if (!link) return next(errors.link.not.found);

        linkManager.update(link, linkFields, function (error, link)
        {
            if (error) return next(error);
            res.redirect('/admin/link');
        });
    }); 
};
