module.exports = {
    appName: 'OpalCMS',
    SITENAME: '酷鱼网',
    LOG4JS: {
        appenders: [
            {type: 'console'}
        ]
    },
    NODEENV: 'testing',
    EXPRESS: {
        PORT: process.env.port || 9901,
    },
    HOST: 'http://www.coolfishstudio.com',
    MONGO: {
        URL: 'mongodb://127.0.0.1:27017/opalcms',
    },
    UPLOAD_PATH: './public/images/timthumb',
    UPLOAD_CONTENT_PATH: './public/images/content',
    ADMIN: {
        USERNAME: '***',
        PASSWORD: '***',
        EMAIL: '***@qq.com',
        QQ: '***'
    },
    // 邮箱配置
    MAIL_OPTS: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: '***@126.com',
            pass: '***',
            name: '***'
        }
    },
    //限制
    LIMIT: {
        TAGS_DEFAULT: 10,
        ADS_DEFAULT: 10,
        LINKS_DEFAULT: 10,
        CATEGORYS_DEFAULT: 10,
        CONTENTS_DEFAULT: 9,
        MESSAGE_DEFAULT: 10,
        COMMENT_DEFAULT: 5
    },
    //默认
    DEFAULT: {
        CATEGORY: [
            { name: '前端技术', weight: 20 },
            { name: '后端技术', weight: 15 },
            { name: '数据存储', weight: 10 },
            { name: '项目笔记', weight: 5 },
            { name: '生活日志', weight: 0 }
        ],
        TAG: [
            { name: 'HTML5', weight: 40 },
            { name: 'CSS3', weight: 35 },
            { name: 'javascript', weight: 30 },
            { name: 'Node.js', weight: 25 },
            { name: 'Mongodb', weight: 20 },
            { name: 'OpalCMS', weight: 15 },
            { name: '特效', weight: 10 },
            { name: '笔记', weight: 5 }
        ]
    }
};