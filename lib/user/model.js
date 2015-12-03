'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
var CONST = require('../util/const');
/**
 * 数据模型
 */
var UserSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true,
            match: [
                /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                'Invalid email'
            ]
        },//账户即邮箱
        username: { type: String, default: '' },//用户名
        source: { type: String, default: 'user', enum: CONST.CONTENT_SOURCE_TYPES},//预留 用户来源 用来区分是机器人还是真实用户
        emailVerified: { type: Boolean, default: false },//用户是否激活    
        password: { type: String, default: '' },//密码
        salt: { type: String, default: '' },//自我描述
        createdAt: { type: Date, default: Date.now },
        firstLoginAt: { type:Date, default: null },
        lastLoginAt: { type: Date, default: null },
        updatedAt: { type: Date, default: null },
        verifiedAt: { type: Number, default: 0 },
        lastEmailSentAt: { type: Date, default: null },
        totalLoginSuccess: { type: Number, default: 0 },
        totalLoginFail: { type: Number, default: 0 },
        role: { type: String, default: 'user', enum: CONST.USER_ROLES },
    },
    {
        collection: 'user'
    }
);
/**
 * 数据格式校验
 */
UserSchema.static('validateAndFormatError', function (user, callback)
{
    return user.validate(function (error)
    {
        callback(error);
    });
});
/**
 * getByID
 */
UserSchema.static('getByID', function (userID, callback)
{
    if (!userID) return callback(errors.user.invalid.id, null);
    return this.findById(userID, function (error, user)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.user.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, user);
    });
});
/**
 * getByEmail
 */
UserSchema.static('getByEmail', function (email, callback)
{
    if (!email) return callback(errors.user.invalid.email, null);
    return this.findOne({ email: email }, callback);
});
/**
 * getByUsername
 */
UserSchema.static('getByUsername', function (username, callback)
{
    if (!username) return callback(errors.user.invalid.username, null);
    return this.findOne({ username: username }, callback);
});
/**
 * findAll
 */
UserSchema.static('findAll', function (queryOptions, callback)
{
    var query = this.find({});
    if ('function' === typeof queryOptions)
    {
        callback = queryOptions;
        queryOptions = {};
    }

    if (undefined !== queryOptions.limit)
        query.limit(queryOptions.limit);
    if (undefined !== queryOptions.offset)
        query.skip(queryOptions.offset);

    query.exec(callback);
});
/**
 * countAll
 */
UserSchema.static('countAll', function (callback)
{
    return this.count({}, callback);
});
//保存
UserSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
UserSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {};
UserSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var User = mongoose.model('User', UserSchema);

module.exports = User;