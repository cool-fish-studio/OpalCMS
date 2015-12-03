'use strict';

var async = require('async');

var Ad = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Ad.getByID.bind(Ad);

//插入数据
module.exports.insert = function (adFields, callback)
{
    var ad = new Ad(adFields);
    //检查数据格式
    Ad.validateAndFormatError(ad, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        ad.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Ad.countAll.bind(Ad),
        ads: Ad.findAll.bind(Ad, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.ads.length, queryOptions),
                list: args.ads
            }
        );
    });
};

//修改
module.exports.update = function (ad, updatedFields, callback)
{
    for (var field in updatedFields)
        ad[field] = updatedFields[field];

    Ad.validateAndFormatError(ad, function (error)
    {
        if (error) return callback(error, null);

        ad.save(callback);
    });
};

//删除
module.exports.remove = function (ad, callback)
{
    ad.removed = true;

    Ad.validateAndFormatError(ad, function (error)
    {
        if (error) return callback(error, null);

        ad.save(callback);
    });
};
