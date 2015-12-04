'use strict';

var fs = require('fs');

var formidable = require('formidable');

var config = require('../../config');

module.exports.upload = function (req, res, callback)
{
    var form = new formidable.IncomingForm();// for parsing multipart/form-data
    form.parse(req, function (error, fields, file)
    {
        if (error) return callback(error);

        var types = file.themesImage.name.split('.');
        var ms = new Date().getTime();
        var imagePath = config.UPLOAD_PATH + '/' + ms + '.' + String(types[types.length-1]);

        fields.themesImage = imagePath;
        fs.rename(file.themesImage.path, imagePath, function (error)
        {
            callback(error, fields);
        });
    });
};
