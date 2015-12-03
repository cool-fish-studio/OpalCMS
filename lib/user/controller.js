'use strict';

var userManager = require('./manager');
var errors = require('../util/error').errors;
var config = require('../../config');

var log = require('log4js').getLogger('userController');

//插入数据
module.exports.insert = function (req, res, next)
{
    //todo 校验
    var userFields = {
        username: req.body.email,
        email: req.body.email,
        password: req.body.password
    };
    userManager.insert(userFields, function (error, user)
    {
        if (error) return next(error);
        res.status(201).json({ item: user });
    });
};
//根据id查找
module.exports.getByID = function (req, res, next)
{
    userManager.getByID(
        req.params.userID, 
        function (error, user)
    {
        if (error) return next(error);
        if (!user) return next(errors.user.not.found);
        res.json({ item: user });
    }); 
};
//根据email查找
module.exports.getByEmail = function (req, res, next)
{
    userManager.getByEmail(
        req.params.email, 
        function (error, user)
    {
        if (error) return next(error);
        if (!user) return next(errors.user.not.found);
        res.json({ item: user });
    }); 
};
//查看全部
module.exports.findAll = function (req, res, next)
{
    userManager.findAll(function (error, paginatedUsers)
    {
        if (error) return next(error);
        res.json({
            meta: paginatedUsers.meta,
            list: paginatedUsers.list
        });
    });
};