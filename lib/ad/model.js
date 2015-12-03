'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var AdSchema = new Schema(
    {
        name: { type: String, required: true },
        weight: { type: Number, default: 0 },
        url: { type: String, required: true },
        imageID : { type: Schema.Types.ObjectId, default: null },
        createdByID: { type: Schema.Types.ObjectId, required: true },

        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: 'ad'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
AdSchema.static('validateAndFormatError', function (ad, callback)
{
    return ad.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
AdSchema.static('getByID', function (adID, callback)
{
    return this.findById(adID, function (error, ad)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.ad.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, ad);
    });
});
//查找全部
AdSchema.static('findAll', function (queryOptions, callback)
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
AdSchema.static('countAll', function (callback)
{
    return this.count({ removed: false }, callback);
});
//保存
AdSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
AdSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!AdSchema.options.toJSON) AdSchema.options.toJSON = {};
AdSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;