'use strict';

var adManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;
    adManager.findAllPaginated(
        helper.getFromReq(req.query, config.LIMIT.ADS_DEFAULT),
        function (error, paginatedAds)
    {
        if (error) return next(error);

        context.ads = paginatedAds;
        res.render('admin/ad/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    res.render('admin/ad/create');
};
//创建标签
module.exports.applyCreate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';

    if (!name || !weight)
        return next(errors.ad.parameter.deficiency);

    var adFields = {
        name: name,
        weight: weight,
        createdByID: req.user.id
    };
    adManager.insert(adFields, function (error, ad)
    {
        if (error) return next(error);
        res.redirect('/admin/ad');
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;
    adManager.getByID(
        req.params.adID, 
        function (error, ad)
    {
        if (error) return next(error);
        if (!ad) return next(errors.ad.not.found);
        context.ad = ad;
        res.render('admin/ad/remove');
    }); 
};
//删除标签
module.exports.applyRemove = function (req, res, next)
{
    adManager.getByID(
        req.params.adID, 
        function (error, ad)
    {
        if (error) return next(error);
        if (!ad) return next(errors.ad.not.found);

        adManager.remove(ad, function (error, ad)
        {
            if (error) return next(error);
            res.redirect('/admin/ad');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;
    adManager.getByID(
        req.params.adID, 
        function (error, ad)
    {
        if (error) return next(error);
        if (!ad) return next(errors.ad.not.found);
        context.ad = ad;
        res.render('admin/ad/update');
    }); 
};
//修改标签
module.exports.applyUpdate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';
    
    if (!name || !weight)
        return next(errors.ad.parameter.deficiency);

    var adFields = {
        name: name,
        weight: weight
    };

    adManager.getByID(
        req.params.adID, 
        function (error, ad)
    {
        if (error) return next(error);
        if (!ad) return next(errors.ad.not.found);

        adManager.update(ad, adFields, function (error, ad)
        {
            if (error) return next(error);
            res.redirect('/admin/ad');
        });
    }); 
};
