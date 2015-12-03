'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var LinkSchema = new Schema(
    {
        name: { type: String, required: true },
        weight: { type: Number, default: 0 },
        url: { type: String, required: true },
        createdByID: { type: Schema.Types.ObjectId, required: true },

        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: 'link'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
LinkSchema.static('validateAndFormatError', function (link, callback)
{
    return link.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
LinkSchema.static('getByID', function (linkID, callback)
{
    return this.findById(linkID, function (error, link)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.link.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, link);
    });
});
//查找全部
LinkSchema.static('findAll', function (queryOptions, callback)
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
LinkSchema.static('countAll', function (callback)
{
    return this.count({ removed: false }, callback);
});
//保存
LinkSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
LinkSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!LinkSchema.options.toJSON) LinkSchema.options.toJSON = {};
LinkSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Link = mongoose.model('Link', LinkSchema);

module.exports = Link;