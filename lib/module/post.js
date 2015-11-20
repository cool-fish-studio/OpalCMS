'use strict';

var mongoPost = require('../mongo/mongoPost');

module.exports.insert = mongoPost.insert;

module.exports.update = mongoPost.update;

module.exports.remove = mongoPost.remove;

module.exports.getByID = function (id, callback)
{
    mongoPost.getByOptions({ _id: id }, callback);
};

module.exports.findByUserID = function (userID, callback)
{
    mongoPost.findByOptions({ userID: userID }, {}, callback);
};

module.exports.findByTagID = function (tagID, callback)
{
    mongoPost.findByOptions({ tagID: tagID }, {}, callback);
};

module.exports.countByTagID = function (tagID, callback)
{
    mongoPost.countByOptions({ tagID: tagID }, callback);
};

module.exports.findAll = function (callback)
{
    mongoPost.findByOptions({}, {}, callback);
};

module.exports.countAll = function (callback)
{
    mongoPost.countByOptions({}, callback);
};