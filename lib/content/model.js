'use strict';

var mongoose = require('../util/db').mongoose;
var Schema = mongoose.Schema;

var errors = require('../util/error').errors;
var CONST = require('../util/const');

/**
 *  数据模型
 *
 *  名字，创建者ID，创建时间
 */
var ContentSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        themesImage: { type: String, required: true },

        keywords: { type: String, default: '' },
        discription: { type: String, required: true },
        category: { 
            type: Schema.Types.ObjectId, 
            required: true,
            ref: 'Category'
        },
        tags: [{ 
            type: Schema.Types.ObjectId, 
            required: true,
            ref: 'Tag'
        }], 
        type: { type: String, default: 'post', enum: CONST.CONTENT_TYPES },
        isTop: { type: Boolean, default: false },

        totalComment: { type: Number, default: 0 },
        totalLike: { type: Number, default: 0 },
        totalClick: { type: Number, default: 0 },

        source: { type: String, default: 'user', enum: CONST.CONTENT_SOURCE_TYPES },
        createdByID: { type: Schema.Types.ObjectId, required: true },
        removed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },

        //插件 作品
        repositoryPath : { type: String, default: '' }, // git 知识库路径
        downPath : { type: String, default: '' }, // git 项目下载地址
        previewPath : { type: String, default: '' } // 插件预览地址
    },
    {
        collection: 'content'
    }
);

/**
 *  数据操作监听
 */
//数据格式校验
ContentSchema.static('validateAndFormatError', function (content, callback)
{
    return content.validate(function (error)
    {
        callback(error);
    });
});
//根据id查找
ContentSchema.static('getByID', function (contentID, callback)
{
    return this.findById({_id: contentID})
        .populate('category')
        .populate('tags')
        .exec(function (error, content)
    {
        if (error && 'CastError' === error.name && 'ObjectId' === error.kind)
            return callback(errors.content.invalid.id, null);
        if (error)
            return callback(error, null);

        callback(null, content);
    });
});

//查找全部
ContentSchema.static('findAll', function (queryOptions, callback)
{
    var ops = { removed: false };
    if (undefined !== queryOptions.type)
        ops.type = queryOptions.type;
    var query = this.find(ops)
        .populate('category')
        .populate('tags')
        .sort({ 'createdAt': -1 });
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
ContentSchema.static('countAll', function (queryOptions, callback)
{
    var ops = { removed: false };
    if (undefined !== queryOptions.type)
        ops.type = queryOptions.type;
    return this.count(ops, callback);
});
//保存
ContentSchema.pre('save', function (next)
{
    this.updatedAt = new Date();
    next();
});
//处理 _id
ContentSchema.set('toJSON', { getters: true, virtuals: true, versionKey: false });
if (!ContentSchema.options.toJSON) ContentSchema.options.toJSON = {};
ContentSchema.options.toJSON.transform = function (doc, ret, options)
{
    delete ret._id;
};

var Content = mongoose.model('Content', ContentSchema);

module.exports = Content;