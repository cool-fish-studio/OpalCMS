'use strict';

var async = require('async');

var Message = require('./model');

var helper = require('../util/helper');

//根据id查找数据
module.exports.getByID = Message.getByID.bind(Message);

//插入数据
module.exports.insert = function (messageFields, callback)
{
    var message = new Message(messageFields);
    //检查数据格式
    Message.validateAndFormatError(message, function (error)
    {
        if (error) return callback(error, null);
        //录入数据
        message.save(callback);
    });
};

//查找全部
module.exports.findAllPaginated = function (queryOptions, callback)
{
    //此类数据 返回格式包含列表和数量 用来处理后期分页问题
    async.parallel({
        total: Message.countAll.bind(Message),
        messages: Message.findAll.bind(Message, queryOptions)
    }, function (error, args)
    {
        if (error) return callback(error, null);
        callback(
            null, 
            {
                meta: helper.getMeta(args.total, args.messages.length, queryOptions),
                list: args.messages
            }
        );
    });
};

//修改
module.exports.update = function (message, updatedFields, callback)
{
    for (var field in updatedFields)
        message[field] = updatedFields[field];

    Message.validateAndFormatError(message, function (error)
    {
        if (error) return callback(error, null);

        message.save(callback);
    });
};

//删除
module.exports.remove = function (message, callback)
{
    message.removed = true;

    Message.validateAndFormatError(message, function (error)
    {
        if (error) return callback(error, null);

        message.save(callback);
    });
};
