var crypto = require('crypto');//加密模块
var nodemailer = require('nodemailer');//邮件模块
var config = require('../../config');

var log = require('log4js').getLogger('helper');

//MD5加密
module.exports.getMD5 = function(str){
    var result = '';
    var md5_str = crypto.createHash('md5');
    result = md5_str.update(str).digest('hex');
    return result;
};

//发送邮件
module.exports.sendActiveMail = function(user, callback){
    var time = new Date().getTime();
    var link = config.HOST + '/auth/activate/' + user.email + '/' + exports.getMD5(user.password) + time;
    var html = '<style type="text/css">.cfs_letterBox{padding:40px;text-align:center;background:#d2d2d2;}.cfs_letterBox a{color:#407700;}.cfs_letter{width:580px;margin:0 auto;padding:10px;color:#333;background-color:#fff;border:0px solid#aaa;border-radius:5px;-webkit-box-shadow:3px 3px 10px#999;box-shadow:3px 3px 10px#999;font-family:Verdana,sans-serif;}.cfs_letterHeader{height:23px;}.cfs_letterTitle{height:48px;}.cfs_letterTitle h1{margin:0;color:#407700;}.cfs_letterTitle_line{height:2px;font-size:0;margin:10px auto 5px auto;background:#407700;width:90%;}.cfs_letterContent{text-align:left;padding:30px;font-size:14px;line-height:1.5em;}.cfs_letterContent p{word-wrap:break-word;word-break:break-all;}.cfs_letterInscribe{padding:40px 0 0;overflow:hidden;}.cfs_letterInscribe img{float:right;width:79px;border-radius:5px;}.cfs_letterSender{float:right;text-align:right;margin:0 10px 0 0;}.cfs_letterSenderName{margin:0 0 8px;font-size:16px;}.cfs_letterSenderInfo{font-size:12px;margin:0;line-height:1.2em;}.cfs_letterSenderAsk{font-size:12px;margin:0;}.cfs_letterFooter{margin:16px;text-align:center;font-size:12px;color:#888;text-shadow:1px 0px 0px#eee;}</style><div class="cfs_letterBox"><div class="cfs_letter"><div class="cfs_letterHeader"></div><div class="cfs_letterTitle"><h1>' + config.SITENAME + '</h1><div class="cfs_letterTitle_line"></div></div><div class="cfs_letterContent"><div><p>您好, ' + user.username + ' !</p><p>感谢你注册' + config.SITENAME + '。<br>你的登录账户为：<a href="javascript:;">' + user.email + '</a>。请点击以下链接激活帐号：</p><p><a href="' + link + '"target="_blank">' + link + '</p><p>如果以上链接无法点击，请将上面的地址复制到你的浏览器(如IE)的地址栏进入' + config.SITENAME + '平台进行激活。 （该链接在24小时内有效，24小时后需要重新注册）</p></div><div class="cfs_letterInscribe"><img src="' + config.HOST + '/images/admin.png"><div class="cfs_letterSender"><p class="cfs_letterSenderName">' + config.ADMIN.USERNAME + '</p><p class="cfs_letterSenderInfo">' + config.SITENAME + '开发者<br><a href="mailto:' + config.ADMIN.EMAIL + '"target="_blank">' + config.ADMIN.EMAIL + '</a></p><p class="cfs_letterSenderAsk">有问题、有建议，欢迎大家与我联系。</p></div></div></div><div class="cfs_letterFooter"><p>本邮件由&nbsp;<a href="' + config.HOST + '" target="_blank">' + config.SITENAME + '</a>&nbsp;自动发出，无需回复。</p></div></div></div>';
    var transporter = nodemailer.createTransport(
        config.MAIL_OPTS
    );
    var mailOptions = {
        from: config.MAIL_OPTS.auth.name + '<' + config.MAIL_OPTS.auth.user + '>',
        to: user.email,
        subject: '您好 ' + user.username + '，请激活您的' + config.SITENAME + '平台账户',
        html: html
    };
    transporter.sendMail(mailOptions, callback);
};

module.exports.getFromReq = function (query, defaultLimit)
{
    var num = query.p || 1;
    var offset = parseInt(query.offset || ((num - 1) * defaultLimit), 10);
    if (true === isNaN(offset) || 0 > offset)
        offset = 0;

    var limit = parseInt(query.limit, 10);
    if (true === isNaN(limit) || limit <= 0 || limit > defaultLimit)
        limit = defaultLimit;

    return {
        offset: offset,
        limit: limit
    };
};

module.exports.getMeta = function (totalLength, currentLength, pagination)
{
    return {
        offset: pagination.offset,
        limit: pagination.limit,
        total: totalLength,
        length: currentLength,
        remaining: currentLength === 0 ? 0 : totalLength - pagination.offset - currentLength
    };
};


module.exports.html2Escape = function (sHtml) 
{
    return sHtml.replace(/[<>&"]/g, 
        function (c)
        {
            return {
                '<':'&lt;', 
                '>':'&gt;', 
                '&':'&amp;', 
                '"':'&quot;'
            }[c];
        });
};



