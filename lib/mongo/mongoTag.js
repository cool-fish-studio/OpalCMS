'use strict';

var tagSchema = require('./mongo').getCollection('tag');

//创建
module.exports.insert = function (fields, callback)
{
    fields.createAt = new Date().getTime();
    tagSchema.insert(fields, callback);
};
//修改
module.exports.update = function (queryID, fields, callback)
{
    fields.updateAt = new Date().getTime();
    tagSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//删除
module.exports.remove = function (queryID, callback)
{
    var fields = {};
    fields.updateAt = new Date().getTime();
    fields.removed = true;
    tagSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//根据条件查询某一个
module.exports.getByOptions = function (queryOptions, callback)
{
    tagSchema.findOne({ _id: queryOptions }, callback);
};
//根据条件查询一些 todo pageOptions
module.exports.findByOptions = function (queryOptions, pageOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    tagSchema.find(queryOptions).toArray(callback);
};
//根据某些条件查询总数
module.exports.countByOptions = function (queryOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    tagSchema.count(queryOptions, callback);
};