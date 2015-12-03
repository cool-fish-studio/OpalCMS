'use strict';

var userManager = require('../user/manager');
var errors = require('../util/error').errors;
var helper = require('../util/helper');
var authManager = require('./manager');

var log = require('log4js').getLogger('authController');
//注册
module.exports.signup = function (req, res, next)
{
    var context = res.locals.context;

    var email = req.body.email || '';
    var password = req.body.password || '';
    var username = req.body.username || '';

    if (!email || !password || !username)
        return next(errors.user.parameter.deficiency);
    log.info('检测邮箱[' + email + ']是否存在。');
    userManager.getByEmail(email, function (error, user)
    {
        if (error) return next(error);
        if (user) return next(errors.user.has.email);

        userManager.getByUsername(username, function (error, user)
        {
            if (error) return next(error);
            if (user) return next(errors.user.has.username);

            var userFields = {
                username: username,
                email: email,
                password: helper.getMD5(password)
            };

            log.info('创建注册账户[' + userFields.email + '], 密码为: ' + password);
            userManager.insert(userFields, function (error, user)
            {
                if (error) return next(error);
                log.info('普通用户[' + user.email + ']' + (!user ? '创建失败。' : '创建成功。'));
                if (user && !user.emailVerified) 
                    log.info('普通用户[' + user.email + ']还没有激活,请前往邮箱进行激活');
                
                var updateFields = {
                    lastEmailSentAt: new Date().getTime()
                };
                userManager.update(user, updateFields, function (error, user)
                {
                    helper.sendActiveMail(user, function (error)
                    {
                        if (error) return log.error('发送邮件[' + user.email + ']时，发送错误');
                        log.info('普通用户[' + user.email + ']激活邮件已发送');
                        user.password = null;
                        context.user = user;
                        res.redirect('/');
                    });
                });
            });
        });
    });
};
//登录
module.exports.signin = function (req, res, next)
{
    var context = res.locals.context;

    var email = req.body.email || '';
    var password = req.body.password || '';

    if (!email || !password)
        return next(errors.user.parameter.deficiency);

    log.info('检测邮箱[' + email + ']是否存在。');
    authManager.login(req, res, function (error)
    {
        if (error) return next(error);
        if (context.user.role === 'admin') return res.redirect('/admin');
        res.redirect('/');
    });
};
//退出
module.exports.signout = function (req, res, next)
{
    req.logout();
    res.redirect('/');
};
//激活
module.exports.activate = function (req, res, next)
{
    var context = res.locals.context;
    var email = req.params.email || '';
    var pwdTime = req.params.pwdTime || '';

    if (!email || !pwdTime)
        return next(errors.user.activate.url);

    log.info('检测邮箱[' + email + ']是否存在。');
    userManager.getByEmail(email, function (error, user)
    {
        if (error) return next(error);
        if (!user)
        {
            context.formErrors = errors.user.not.found;
            return res.render('activate');
        }
        context.user = user;
        //判断是否过期
        var sentTime = new Date(parseInt(pwdTime.substring(pwdTime.length - 13, pwdTime.length)));
        var nowTime = new Date().getTime();

        if (!((nowTime > sentTime) && (nowTime - sentTime) < 24*60*60*1000))
        {
            context.formErrors = errors.user.activate.timeout;
            return res.render('activate');
        }

        var updateFields = {
            emailVerified: true,
            verifiedAt: new Date().getTime()
        };
        userManager.update(user, updateFields, function (error, user)
        {
            if (error) return next(error);
            log.info('邮箱[' + user.email + ']已经被激活');
            user.password = null;
            context.user = user;
            res.render('activate');
        });
    });
};
//后台登录界面
module.exports.viewSignin = function (req, res, next)
{
    res.render('admin/auto/login');
};