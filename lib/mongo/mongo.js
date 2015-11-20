'use strict';

var config = require('../../config');//获取配置文件的信息
var mongoskin = require('mongoskin');//加载被封装过的mongodb模块

var db = null;
//数据库连接
exports.getCollection = function (collectionName)
{
    if (!db)
    {
        //第一次连接
        db = mongoskin.db(
            config.MONGO_URL + '?auto_reconnect=true&poolSize=3',
            { numberOfRetries: 1, retryMiliSeconds: 500, safe: true, native_parser: true },
            { socketOptions: { timeout: 5000 } });
    }
    return db.collection(collectionName);
};