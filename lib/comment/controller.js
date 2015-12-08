'use strict';

var commentManager = require('./manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var config = require('../../config');

//页面列表
module.exports.viewList = function (req, res, next)
{
    var context = res.locals.context;
    context.contentID = req.params.contentID;
    commentManager.findAllPaginated(
        helper.getFromReq(req.query, config.LIMIT.MESSAGES_DEFAULT),
        function (error, paginatedComments)
    {
        if (error) return next(error);

        context.comments = paginatedComments;
        res.render('admin/comment/list');
    }); 
};
//创建页面
module.exports.viewCreate = function (req, res, next)
{
    var context = res.locals.context;
    context.contentID = req.params.contentID;
    res.render('admin/comment/create');
};
//创建
module.exports.applyCreate = function (req, res, next)
{
    var name = req.body.name || '';
    var email = req.body.email || '';
    var content = req.body.content || '';
    
    if (!name || !email || !content)
        return next(errors.comment.parameter.deficiency);

    var commentFields = {
        name: name,
        email: email,
        content: content,
        contentID: req.params.contentID,
        createdByID: req.user.id
    };
    commentManager.insert(commentFields, function (error, comment)
    {
        if (error) return next(error);
        res.redirect('/admin/comment');
    });
};
//删除页面
module.exports.viewRemove = function (req, res, next)
{
    var context = res.locals.context;
    context.contentID = req.params.contentID;
    commentManager.getByID(
        req.params.commentID, 
        function (error, comment)
    {
        if (error) return next(error);
        if (!comment) return next(errors.comment.not.found);
        context.comment = comment;
        res.render('admin/comment/remove');
    }); 
};
//删除
module.exports.applyRemove = function (req, res, next)
{
    commentManager.getByID(
        req.params.commentID, 
        function (error, comment)
    {
        if (error) return next(error);
        if (!comment) return next(errors.comment.not.found);

        commentManager.remove(comment, function (error, comment)
        {
            if (error) return next(error);
            res.redirect('/admin/comment');
        });
    }); 
};
//修改页面
module.exports.viewUpdate = function (req, res, next)
{
    var context = res.locals.context;
    context.contentID = req.params.contentID;
    commentManager.getByID(
        req.params.commentID, 
        function (error, comment)
    {
        if (error) return next(error);
        if (!comment) return next(errors.comment.not.found);
        context.comment = comment;
        res.render('admin/comment/update');
    }); 
};
//修改
module.exports.applyUpdate = function (req, res, next)
{
    var name = req.body.name || '';
    var email = req.body.email || '';
    var content = req.body.content || '';
    
    if (!name || !email || !content)
        return next(errors.comment.parameter.deficiency);

    var commentFields = {
        name: name,
        email: email,
        content: content
    };

    commentManager.getByID(
        req.params.commentID, 
        function (error, comment)
    {
        if (error) return next(error);
        if (!comment) return next(errors.comment.not.found);

        commentManager.update(comment, commentFields, function (error, comment)
        {
            if (error) return next(error);
            res.redirect('/admin/comment');
        });
    }); 
};
