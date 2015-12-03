'use strict';

var categoryManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;
    categoryManager.findAllPaginated(
        helper.getFromReq(req.query, config.LIMIT.CATEGORYS_DEFAULT),
        function (error, paginatedCategorys)
    {
        if (error) return next(error);

        context.categorys = paginatedCategorys;
        res.render('admin/category/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    res.render('admin/category/create');
};
//创建标签
module.exports.applyCreate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';

    if (!name || !weight)
        return next(errors.category.parameter.deficiency);

    var categoryFields = {
        name: name,
        weight: weight,
        createdByID: req.user.id
    };
    categoryManager.insert(categoryFields, function (error, category)
    {
        if (error) return next(error);
        res.redirect('/admin/category');
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;
    categoryManager.getByID(
        req.params.categoryID, 
        function (error, category)
    {
        if (error) return next(error);
        if (!category) return next(errors.category.not.found);
        context.category = category;
        res.render('admin/category/remove');
    }); 
};
//删除标签
module.exports.applyRemove = function (req, res, next)
{
    categoryManager.getByID(
        req.params.categoryID, 
        function (error, category)
    {
        if (error) return next(error);
        if (!category) return next(errors.category.not.found);

        categoryManager.remove(category, function (error, category)
        {
            if (error) return next(error);
            res.redirect('/admin/category');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;
    categoryManager.getByID(
        req.params.categoryID, 
        function (error, category)
    {
        if (error) return next(error);
        if (!category) return next(errors.category.not.found);
        context.category = category;
        res.render('admin/category/update');
    }); 
};
//修改标签
module.exports.applyUpdate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';
    
    if (!name || !weight)
        return next(errors.category.parameter.deficiency);

    var categoryFields = {
        name: name,
        weight: weight
    };

    categoryManager.getByID(
        req.params.categoryID, 
        function (error, category)
    {
        if (error) return next(error);
        if (!category) return next(errors.category.not.found);

        categoryManager.update(category, categoryFields, function (error, category)
        {
            if (error) return next(error);
            res.redirect('/admin/category');
        });
    }); 
};
