'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var MessageSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { 
            type: String, 
            required: true,
            match: [
                /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                'Invalid email'
            ]
        },
        avatar: { type: String, default: null },
        content: { type: String, required: true },

        createdByID: { type: Schema.Types.ObjectId, default: null },

        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: 'message'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
MessageSchema.static('validateAndFormatError', function (message, callback)
{
    return message.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
MessageSchema.static('getByID', function (messageID, callback)
{
    return this.findById(messageID, function (error, message)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.message.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, message);
    });
});
//查找全部
MessageSchema.static('findAll', function (queryOptions, callback)
{
    var query = this.find({ removed: false }).sort({ 'createdAt': -1 });
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
//全部数量
MessageSchema.static('countAll', function (callback)
{
    return this.count({ removed: false }, callback);
});
//保存
MessageSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
MessageSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!MessageSchema.options.toJSON) MessageSchema.options.toJSON = {};
MessageSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;