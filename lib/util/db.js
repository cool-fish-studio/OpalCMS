'use strict';

var config = require('../../config');
var mongoose = require('mongoose');//引入数据库相关模块

var log = require('log4js').getLogger('db');
//连接数据库
mongoose.connect(
    config.MONGO.URL,//数据库地址
    {
        db: {
            native_parser: true
        },
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    }
);

var db = mongoose.connection;
var isReady = false;
var readyWaitingList = [];
/**
 * 监听数据库连接状态
 */
//始终监听报错信息
db.on('error', function (error)
{
    log.error('数据库连接异常：', error);
});

//监听一次连接成功信息
db.once('open', function ()
{
    log.info('数据库已建立连接。');
    isReady = true;

    for (var i = 0; i < readyWaitingList.length; i++)
        readyWaitingList[i]();

    readyWaitingList = null;
});

//用于检测数据库是否正常连接
module.exports.onReady = function (callback)
{
    if (isReady) return callback();
    readyWaitingList.push(callback); 
};

module.exports.mongoose = mongoose;