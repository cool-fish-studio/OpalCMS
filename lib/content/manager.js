'use strict';

var async = require('async');

var Content = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Content.getByID.bind(Content);

//插入数据
module.exports.insert = function (contentFields, callback)
{
    var content = new Content(contentFields);
    //检查数据格式
    Content.validateAndFormatError(content, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        content.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Content.countAll.bind(Content, queryOptions),
        contents: Content.findAll.bind(Content, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.contents.length, queryOptions),
                list: args.contents
            }
        );
    });
};

//修改
module.exports.update = function (content, updatedFields, callback)
{
    for (var field in updatedFields)
        content[field] = updatedFields[field];

    Content.validateAndFormatError(content, function (error)
    {
        if (error) return callback(error, null);

        content.save(callback);
    });
};

//删除
module.exports.remove = function (content, callback)
{
    content.removed = true;

    Content.validateAndFormatError(content, function (error)
    {
        if (error) return callback(error, null);

        content.save(callback);
    });
};
