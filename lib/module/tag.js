'use strict';

var mongoTag = require('../mongo/mongoTag');

module.exports.insert = mongoTag.insert;

module.exports.update = mongoTag.update;

module.exports.remove = mongoTag.remove;

module.exports.getByID = function (id, callback)
{
    mongoTag.getByOptions({ _id: id }, callback);
};

module.exports.findAll = function (callback)
{
    mongoTag.findByOptions({}, {}, callback);
};

module.exports.countAll = function (callback)
{
    mongoTag.countByOptions({}, callback);
};