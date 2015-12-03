'use strict';

var async = require('async');

var Link = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Link.getByID.bind(Link);

//插入数据
module.exports.insert = function (linkFields, callback)
{
    var link = new Link(linkFields);
    //检查数据格式
    Link.validateAndFormatError(link, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        link.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Link.countAll.bind(Link),
        links: Link.findAll.bind(Link, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.links.length, queryOptions),
                list: args.links
            }
        );
    });
};

//修改
module.exports.update = function (link, updatedFields, callback)
{
    for (var field in updatedFields)
        link[field] = updatedFields[field];

    Link.validateAndFormatError(link, function (error)
    {
        if (error) return callback(error, null);

        link.save(callback);
    });
};

//删除
module.exports.remove = function (link, callback)
{
    link.removed = true;

    Link.validateAndFormatError(link, function (error)
    {
        if (error) return callback(error, null);

        link.save(callback);
    });
};
