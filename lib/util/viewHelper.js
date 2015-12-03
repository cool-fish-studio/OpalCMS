'use strict';

//日期格式化
module.exports.dateFormat = function (date, format)
{
    var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format))
    {
        format = format.replace(RegExp.$1, (date.getFullYear() + '')
                .substr(4 - RegExp.$1.length));
    }
    for (var k in o)
    {
        if (new RegExp('(' + k + ')').test(format))
        {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                    (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return format;
};

module.exports.contentType = function (type)
{
    var typeObj = {
        'post': '文章',      '文章': 'post', 
        'work': '作品',      '作品': 'work', 
        'plugin': '插件',    '插件': 'plugin'
    };
    return typeObj[type];
};