'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userManager = require('../user/manager');
var helper = require('../util/helper');

var errors = require('../util/error').errors;

var log = require('log4js').getLogger('authController');

module.exports.login = function(req, res, callback)
{
    passport.authenticate('local', function (error, user, info)
    {
        var context = res.locals.context;
        if (error) {
            error.code = 500;
            return callback(error);
        }

        if (info) {
            info.code = 400;
            return callback(info);
        }

        req.logIn(user, function (error)
        {
            if (error) return callback(error);
            // for safari 7 days
            req.session.cookie.maxAge = 604800000; // 7*24*60*60*1000 Rememeber for 7 days
            context.user = user;
            callback();
        });
    })(req, res, callback);
};



passport.use('local', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done)
    {
        userManager.getByEmail(email, function (error, user)
        {
            if (error) return done(error);
            if (!user) return done(errors.user.not.found);
            var updateFields = {};

            if (helper.getMD5(password) !== user.password)
            {
                updateFields.totalLoginFail = user.totalLoginFail + 1;
                userManager.update(user, updateFields, function (error, user)
                {
                    if (error) return done(error);
                    log.info('账户[' + user.email + ']登录失败第' + user.totalLoginFail + '次');
                    return done(errors.user.invalid.password);
                });
            } else {
                if (!user.firstLoginAt)
                    updateFields.firstLoginAt = new Date().getTime();
                
                updateFields.lastLoginAt = new Date().getTime();
                updateFields.totalLoginSuccess = user.totalLoginSuccess + 1;    

                userManager.update(user, updateFields, function (error, user)
                {
                    if (error) return done(error);
                    log.info('账户[' + user.email + ']已成功登录');
                    user.password = null;
                    return done(null, user);
                });
            }
        });
    }
));

passport.serializeUser(function (user, done) {//保存user对象
    done(null, user);//可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {//删除user对象
    done(null, user);//可以通过数据库方式操作
});