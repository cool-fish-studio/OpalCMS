'use strict';

var errorHandler = require('../lib/util/errorHandler');
var authMiddleware = require('./middleware/auth');

module.exports = function (app)
{
    //用来检测运行是否成功
    app.get('/ping', function (req, res)
    {
        res.end('OK');
    });

    //类别类型请求转发
    app.use('/file', require('../lib/file/router'));
    //账户模块
    app.use('/auth', require('../lib/auth/router'));
    //标签类型请求转发
    app.use('/admin/tag', require('../lib/tag/router'));
    //广告类型请求转发
    app.use('/admin/ad', require('../lib/ad/router'));
    //友情链接类型请求转发
    app.use('/admin/link', require('../lib/link/router'));
    //文章类型请求转发
    app.use('/admin/content', require('../lib/content/router'));
    //留言类型请求转发
    app.use('/admin/message', require('../lib/message/router'));
    //类别类型请求转发
    app.use('/admin/category', require('../lib/category/router'));

    //后台登录
    app.get('/admin/signin', 
        authMiddleware.adminPageIfLogged, 
        require('../lib/auth/controller').viewSignin);

    /* todo. */
    // app.get('/admin/login', function (req, res, next) {
    //   res.render('admin/auto/login');
    // });
    // app.post('/admin/login', function (req, res, next) {
    //   res.redirect('/admin');
    // });
    app.get('/admin',
        authMiddleware.adminPageIfNotLoggedIn, 
        function (req, res, next) {
            res.render('admin/index', { context: { menu: 'admin_index' } });
    });
    // app.get('/admin/ads', function (req, res, next) {
    //   res.render('admin/ads/list', { context: { menu: 'admin_ads' } });
    // });
    // app.get('/admin/link', function (req, res, next) {
    //   res.render('admin/link/list', { context: { menu: 'admin_link' } });
    // });
    // app.get('/admin/message', function (req, res, next) {
    //   res.render('admin/message/list', { context: { menu: 'admin_message' } });
    // });
    // app.get('/admin/post', function (req, res, next) {
    //   res.render('admin/post/list', { context: { menu: 'admin_post' } });
    // });
    app.get('/admin/stat', function (req, res, next) {
      res.render('admin/stat/details', { context: { menu: 'admin_stat' } });
    });
    app.get('/admin/system', function (req, res, next) {
      res.render('admin/system/details', { context: { menu: 'admin_system' } });
    });
    // app.get('/admin/tag', function (req, res, next) {
    //   res.render('admin/tag/list', { context: { menu: 'admin_tag' } });
    // });
    // app.get('/admin/tag/create', function (req, res, next) {
    //   res.render('admin/tag/create', { context: { menu: 'admin_tag' } });
    // });
    app.get('/admin/user', function (req, res, next) {
      res.render('admin/user/list', { context: { menu: 'admin_user' } });
    });

    app.use(require('../lib/front-server/router'));

    // 错误拦截
    app.use(errorHandler.handler404);
    app.use(errorHandler.errorHandler);
};