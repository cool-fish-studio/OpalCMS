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
var messageManager = require('../message/manager');
var commentManager = require('../comment/manager');

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

    var queryOptions = helper.getFromReq(req.query, config.LIMIT.COMMENT_DEFAULT);

    contentManager.getByID(
        req.params.contentID,
        function (error, content)
    {
        if (error) return next(error);
        if (!content) return next(errors.content.not.found);
        context.content = content;
        context.categorys = null;
        context.comments = null;
        contentManager.update(content, {totalClick: content.totalClick + 1}, function (error, content)
        {
            if (error) return next(error);
            categoryManager.findAll(
                function (error, categorys)
            {
                if (error) return next(error);
                context.categorys = categorys;

                commentManager.findAllPaginated(
                    req.params.contentID,
                    queryOptions,
                    function (error, paginatedComments)
                {
                    if (error) return next(error);
                    context.comments = paginatedComments;
                    res.render('article');
                });
            }); 
        });
    }); 
};

module.exports.viewMessage = function (req, res, next)
{
    var context = res.locals.context;

    context.menu = 'message';
    context.isShowBanner = true;

    var queryOptions = helper.getFromReq(req.query, config.LIMIT.MESSAGE_DEFAULT);

    messageManager.findAllPaginated(
        queryOptions,
        function (error, paginatedMessages)
    {
        if (error) return next(error);
        context.messages = paginatedMessages;
        res.render('message');
    });
};

module.exports.applyMessage = function (req, res, next)
{
    var context = res.locals.context;

    context.menu = 'message';
    context.isShowBanner = true;

    var name = helper.html2Escape((req.body.name || '').trim());
    var email = helper.html2Escape((req.body.email || '').trim());
    var content = helper.html2Escape((req.body.content || '').trim());

    var queryOptions = helper.getFromReq(req.query, config.LIMIT.MESSAGE_DEFAULT);
    messageManager.findAllPaginated(
        queryOptions,
        function (error, paginatedMessages)
    {
        if (error) return next(error);
        context.messages = paginatedMessages;
        if (!name || !email || !content)
        {
            context.error = errors.message.parameter.deficiency;
            return res.render('message');
        }
        if (!/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(email))
        {
            context.error = errors.message.invalid.email;
            return res.render('message');
        }
        if (name.length >= 15)
        {
            context.error = errors.message.invalid.name;
            return res.render('message');
        }
        
        var messageFields = {
            name: name,
            email: email,
            content: content
        };
        if (req.user)
            messageFields.createdByID = req.user.id;
        messageManager.insert(messageFields, function (error, message)
        {
            if (error) return next(error);
            res.redirect('/message');
        });

    });
};

module.exports.applyComment = function (req, res, next)
{
    var context = res.locals.context;

    context.menu = req.params.type;
    context.isShowBanner = false;

    var name = helper.html2Escape((req.body.name || '').trim());
    var email = helper.html2Escape((req.body.email || '').trim());
    var commentContent = helper.html2Escape((req.body.content || '').trim());

    var queryOptions = helper.getFromReq(req.query, config.LIMIT.COMMENT_DEFAULT);

    contentManager.getByID(
        req.params.contentID,
        function (error, content)
    {
        if (error) return next(error);
        if (!content) return next(errors.content.not.found);
        context.content = content;
        
        contentManager.update(content, {totalClick: content.totalClick + 1}, function (error, content)
        {
            if (error) return next(error);
            categoryManager.findAll(
                function (error, categorys)
            {
                if (error) return next(error);
                context.categorys = categorys;

                commentManager.findAllPaginated(
                    req.params.contentID,
                    queryOptions,
                    function (error, paginatedComments)
                {
                    if (error) return next(error);
                    context.comments = paginatedComments;
                    if (!name || !email || !content)
                    {
                        context.error = errors.comment.parameter.deficiency;
                        return res.render('article');
                    }
                    if (!/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(email))
                    {
                        context.error = errors.comment.invalid.email;
                        return res.render('article');
                    }
                    if (name.length >= 15)
                    {
                        context.error = errors.comment.invalid.name;
                        return res.render('article');
                    }
                    var commentFields = {
                        name: name,
                        email: email,
                        content: commentContent,
                        contentID: req.params.contentID
                    };
                    if (req.user)
                        commentFields.createdByID = req.user.id;
                    commentManager.insert(commentFields, function (error, comment)
                    {
                        if (error) return next(error);
                        res.redirect('/' + req.params.type + '/' + req.params.contentID);
                    });
                });
            }); 
        });
    }); 
};
