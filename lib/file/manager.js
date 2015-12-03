'use strict';

var fs = require('fs');

var formidable = require('formidable');
var form = new formidable.IncomingForm();// for parsing multipart/form-data

var config = require('../../config');

module.exports.upload = function (req, res, callback)
{
    form.parse(req, function (error, fields, file)
    {
        if (error) return callback(error);

        var types = file.themesImage.name.split('.');
        var date = new Date();
        var ms = Date.parse(date);
        var imagePath = config.UPLOAD_PATH + '/' + ms + '.' + String(types[types.length-1]);

        fields.themesImage = imagePath;
        fs.renameSync(file.themesImage.path, imagePath);

        callback(error, fields);
    });
};
