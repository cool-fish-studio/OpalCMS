'use strict';

var userSchema = require('./mongo').getCollection('user');


//创建
module.exports.insert = function (fields, callback)
{
    fields.createAt = new Date().getTime();
    fields.emailVerified = false;
    userSchema.insert(fields, callback);
};
//修改
module.exports.update = function (queryID, fields, callback)
{
    fields.updateAt = new Date().getTime();
    userSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//删除
module.exports.remove = function (queryID, callback)
{
    var fields = {};
    fields.updateAt = new Date().getTime();
    fields.removed = true;
    userSchema.findAndModify({ _id: queryID }, [], { $set: fields }, { new: true }, callback);
};
//根据条件查询某一个
module.exports.getByOptions = function (queryOptions, callback)
{
    userSchema.findOne(queryOptions, callback);
};
//根据条件查询一些 todo pageOptions
module.exports.findByOptions = function (queryOptions, pageOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    userSchema.find(queryOptions).toArray(callback);
};
//根据某些条件查询总数
module.exports.countByOptions = function (queryOptions, callback)
{
    queryOptions.removed = (queryOptions.removed ? queryOptions.removed : { $ne: true });
    userSchema.count(queryOptions, callback);
};