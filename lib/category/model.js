'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        weight: { type: Number, default: 0 },
        createdByID: { type: Schema.Types.ObjectId, required: true },

        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: 'category'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
CategorySchema.static('validateAndFormatError', function (category, callback)
{
    return category.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
CategorySchema.static('getByID', function (categoryID, callback)
{
    return this.findById(categoryID, function (error, category)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.category.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, category);
    });
});
//查找全部
CategorySchema.static('findAll', function (queryOptions, callback)
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
CategorySchema.static('countAll', function (callback)
{
    return this.count({ removed: false }, callback);
});
//保存
CategorySchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
CategorySchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!CategorySchema.options.toJSON) CategorySchema.options.toJSON = {};
CategorySchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
module.exports.schema = CategorySchema;