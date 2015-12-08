'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var CommentSchema = new Schema(
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

        contentID: { type: Schema.Types.ObjectId, required: true },
        createdByID: { type: Schema.Types.ObjectId, default: null },

        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: 'comment'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
CommentSchema.static('validateAndFormatError', function (comment, callback)
{
    return comment.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
CommentSchema.static('getByID', function (commentID, callback)
{
    return this.findById(commentID, function (error, comment)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.comment.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, comment);
    });
});
//查找全部
CommentSchema.static('findAll', function (contentID, queryOptions, callback)
{
    var query = this.find({ contentID: contentID, removed: false }).sort({ 'createdAt': -1 });
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
CommentSchema.static('countAll', function (contentID, callback)
{
    return this.count({ contentID: contentID, removed: false }, callback);
});
//保存
CommentSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
CommentSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!CommentSchema.options.toJSON) CommentSchema.options.toJSON = {};
CommentSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;