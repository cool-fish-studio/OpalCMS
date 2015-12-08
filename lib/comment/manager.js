'use strict';

var async = require('async');

var Comment = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Comment.getByID.bind(Comment);

//插入数据
module.exports.insert = function (commentFields, callback)
{
    var comment = new Comment(commentFields);
    //检查数据格式
    Comment.validateAndFormatError(comment, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        comment.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Comment.countAll.bind(Comment),
        comments: Comment.findAll.bind(Comment, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.comments.length, queryOptions),
                list: args.comments
            }
        );
    });
};

//修改
module.exports.update = function (comment, updatedFields, callback)
{
    for (var field in updatedFields)
        comment[field] = updatedFields[field];

    Comment.validateAndFormatError(comment, function (error)
    {
        if (error) return callback(error, null);

        comment.save(callback);
    });
};

//删除
module.exports.remove = function (comment, callback)
{
    comment.removed = true;

    Comment.validateAndFormatError(comment, function (error)
    {
        if (error) return callback(error, null);

        comment.save(callback);
    });
};
