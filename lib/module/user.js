'use strict';

var mongoUser = require('../mongo/mongoUser');

module.exports.insert = mongoUser.insert;

module.exports.update = mongoUser.update;

module.exports.remove = mongoUser.remove;

module.exports.getByID = function (id, callback)
{
    mongoUser.getByOptions({ _id: id }, callback);
};

module.exports.getByEmail = function (email, callback)
{
    mongoUser.getByOptions({ email: email }, callback);
};

module.exports.findAll = function (callback)
{
    mongoUser.findByOptions({}, {}, callback);
};

module.exports.countAll = function (callback)
{
    mongoUser.countByOptions({}, callback);
};