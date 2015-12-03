'use strict';

var async = require('async');

var Tag = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Tag.getByID.bind(Tag);

//插入数据
module.exports.insert = function (tagFields, callback)
{
    var tag = new Tag(tagFields);
    //检查数据格式
    Tag.validateAndFormatError(tag, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        tag.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Tag.countAll.bind(Tag),
        tags: Tag.findAll.bind(Tag, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.tags.length, queryOptions),
                list: args.tags
            }
        );
    });
};

//修改
module.exports.update = function (tag, updatedFields, callback)
{
    for (var field in updatedFields)
        tag[field] = updatedFields[field];

    Tag.validateAndFormatError(tag, function (error)
    {
        if (error) return callback(error, null);

        tag.save(callback);
    });
};

//删除
module.exports.remove = function (tag, callback)
{
    tag.removed = true;

    Tag.validateAndFormatError(tag, function (error)
    {
        if (error) return callback(error, null);

        tag.save(callback);
    });
};
