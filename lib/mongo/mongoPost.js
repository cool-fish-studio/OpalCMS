'use strict';

var postSchema = require('./mongo').getCollection('post');

//创建
module.exports.insert = function (fields, callback)
{
    fields.createAt = new Date().getTime();
    postSchema.insert(fields, callback);
};
//修改
module.exports.update = function (queryID, fields, callback)
{
    fields.updateAt = new Date().getTime();
    postSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//删除
module.exports.remove = function (queryID, callback)
{
    var fields = {};
    fields.updateAt = new Date().getTime();
    fields.removed = true;
    postSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//根据条件查询某一个
module.exports.getByOptions = function (queryOptions, callback)
{
    postSchema.findOne(queryOptions, callback);
};
//根据条件查询一些 todo pageOptions
module.exports.findByOptions = function (queryOptions, pageOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    postSchema.find(queryOptions).toArray(callback);
};
//根据某些条件查询总数
module.exports.countByOptions = function (queryOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    postSchema.count(queryOptions, callback);
};