'use strict';

var commentSchema = require('./mongo').getCollection('comment');

//创建
module.exports.insert = function (fields, callback)
{
    fields.createAt = new Date().getTime();
    commentSchema.insert(fields, callback);
};
//修改
module.exports.update = function (queryID, fields, callback)
{
    fields.updateAt = new Date().getTime();
    commentSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//删除
module.exports.remove = function (queryID, callback)
{
    var fields = {};
    fields.updateAt = new Date().getTime();
    fields.removed = true;
    commentSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//根据条件查询某一个
module.exports.getByOptions = function (queryOptions, callback)
{
    commentSchema.findOne(queryOptions, callback);
};
//根据条件查询一些 todo pageOptions
module.exports.findByOptions = function (queryOptions, pageOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    commentSchema.find(queryOptions).toArray(callback);
};
//根据某些条件查询总数
module.exports.countByOptions = function (queryOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    commentSchema.count(queryOptions, callback);
};

/**
 * 常规评论操作
 * 
 * 1.创建评论
 * 2.修改评论
 * 3.删除评论(伪删除)
 * 4.查询全部
 * 5.根据文章id查询评论
 * 6.根据用户id查询评论
 * 7.根据被评论人的id查询评论
 * 8.查询某文章的评论总数
 */