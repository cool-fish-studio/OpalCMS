'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var TagSchema = new Schema(
    {
        name: { type: String, required: true },
        weight: { type: Number, default: 0 },
        createdByID: { type: Schema.Types.ObjectId, required: true },

        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: 'tag'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
TagSchema.static('validateAndFormatError', function (tag, callback)
{
    return tag.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
TagSchema.static('getByID', function (tagID, callback)
{
    return this.findById(tagID, function (error, tag)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.tag.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, tag);
    });
});
//查找全部
TagSchema.static('findAll', function (queryOptions, callback)
{
    var query = this.find({ removed: false }).sort({ 'weight': -1 });
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
TagSchema.static('countAll', function (callback)
{
    return this.count({ removed: false }, callback);
});
//保存
TagSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
TagSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!TagSchema.options.toJSON) TagSchema.options.toJSON = {};
TagSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;
module.exports.schema = TagSchema;