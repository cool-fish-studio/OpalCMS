'use strict';

var async = require('async');

var Category = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Category.getByID.bind(Category);
module.exports.findAll = Category.findAll.bind(Category);
//插入数据
module.exports.insert = function (categoryFields, callback)
{
    var category = new Category(categoryFields);
    //检查数据格式
    Category.validateAndFormatError(category, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        category.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Category.countAll.bind(Category),
        categorys: Category.findAll.bind(Category, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.categorys.length, queryOptions),
                list: args.categorys
            }
        );
    });
};

//修改
module.exports.update = function (category, updatedFields, callback)
{
    for (var field in updatedFields)
        category[field] = updatedFields[field];

    Category.validateAndFormatError(category, function (error)
    {
        if (error) return callback(error, null);

        category.save(callback);
    });
};

//删除
module.exports.remove = function (category, callback)
{
    category.removed = true;

    Category.validateAndFormatError(category, function (error)
    {
        if (error) return callback(error, null);

        category.save(callback);
    });
};
