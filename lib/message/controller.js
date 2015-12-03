'use strict';

var messageManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;
    messageManager.findAllPaginated(
        helper.getFromReq(req.query, config.LIMIT.MESSAGES_DEFAULT),
        function (error, paginatedMessages)
    {
        if (error) return next(error);

        context.messages = paginatedMessages;
        res.render('admin/message/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    res.render('admin/message/create');
};
//创建标签
module.exports.applyCreate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';

    if (!name || !weight)
        return next(errors.message.parameter.deficiency);

    var messageFields = {
        name: name,
        weight: weight,
        createdByID: req.user.id
    };
    messageManager.insert(messageFields, function (error, message)
    {
        if (error) return next(error);
        res.redirect('/admin/message');
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;
    messageManager.getByID(
        req.params.messageID, 
        function (error, message)
    {
        if (error) return next(error);
        if (!message) return next(errors.message.not.found);
        context.message = message;
        res.render('admin/message/remove');
    }); 
};
//删除标签
module.exports.applyRemove = function (req, res, next)
{
    messageManager.getByID(
        req.params.messageID, 
        function (error, message)
    {
        if (error) return next(error);
        if (!message) return next(errors.message.not.found);

        messageManager.remove(message, function (error, message)
        {
            if (error) return next(error);
            res.redirect('/admin/message');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;
    messageManager.getByID(
        req.params.messageID, 
        function (error, message)
    {
        if (error) return next(error);
        if (!message) return next(errors.message.not.found);
        context.message = message;
        res.render('admin/message/update');
    }); 
};
//修改标签
module.exports.applyUpdate = function (req, res, next)
{
    var name = req.body.name || '';
    var weight = req.body.weight || '';
    
    if (!name || !weight)
        return next(errors.message.parameter.deficiency);

    var messageFields = {
        name: name,
        weight: weight
    };

    messageManager.getByID(
        req.params.messageID, 
        function (error, message)
    {
        if (error) return next(error);
        if (!message) return next(errors.message.not.found);

        messageManager.update(message, messageFields, function (error, message)
        {
            if (error) return next(error);
            res.redirect('/admin/message');
        });
    }); 
};
