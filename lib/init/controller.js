'use strict';

var async = require('async');
var log = require('log4js').getLogger('initController');

var userManager = require('../user/manager');
var tagManager = require('../tag/manager');
var categoryManager = require('../category/manager');

var errors = require('../util/error').errors;
var config = require('../../config');
var helper = require('../util/helper');


module.exports.initUser = function (next)
{
    log.info('检测管理员账户是否存在。');
    userManager.getByEmail(config.ADMIN.EMAIL, function (error, user)
    {
        if (error) return next(error);
        log.info('管理员账户' + (!user ? '不存在, 准备初始化。' : ('[' + user.email + ']已存在。')));
        if (user && !user.emailVerified) log.info('管理员账户[' + user.email + '] 还没有激活,请前往邮箱进行激活');
        if (user) return;
        var userFields = {
            username: config.ADMIN.USERNAME,
            email: config.ADMIN.EMAIL,
            password: helper.getMD5(config.ADMIN.PASSWORD),
            role: 'admin'
        };
        log.info('初始化管理员账户[' + userFields.email + '], 初始密码为: ' + config.ADMIN.PASSWORD);
        userManager.insert(userFields, function (error, user)
        {
            if (error) return next(error);
            log.info('管理员账户[' + user.email + ']' + (!user ? '创建失败。' : '创建成功。'));
            if (user && !user.emailVerified) 
                log.info('管理员账户[' + user.email + ']还没有激活,请前往邮箱进行激活');
            
            var updateFields = {
                lastEmailSentAt: new Date().getTime()
            };
            userManager.update(user, updateFields, function (error, user)
            {
                helper.sendActiveMail(user, function (error)
                {
                    if (error) return log.error('发送邮件[' + user.email + ']时，发送错误');
                    log.info('管理员账户[' + user.email + ']激活邮件已发送');
                    log.info('初始化默认数据');
                    async.parallel({
                        categorys: function (done)
                        {
                            async.forEach(config.DEFAULT.CATEGORY, function (item, doneCategory)
                            {
                                item.createdByID = user.id;
                                categoryManager.insert(item, function (error, category)
                                {
                                    if (error) return doneCategory(error);
                                    doneCategory(null);
                                });
                            }, function (error)
                            {
                                if (error) return done(error);
                                done(null);
                            });
                        },
                        tags: function (done)
                        {
                            async.forEach(config.DEFAULT.TAG, function (item, doneTag)
                            {
                                item.createdByID = user.id;
                                tagManager.insert(item, function (error, tag)
                                {
                                    if (error) return doneTag(error);
                                    doneTag(null);
                                });
                            }, function (error)
                            {
                                if (error) return done(error);
                                done(null);
                            });
                        }
                    }, function (error, args)
                    {
                        if (error) return log.error('初始化数据失败');
                        log.info('初始化数据结束');
                    });
                });
            });
        });
    });
};