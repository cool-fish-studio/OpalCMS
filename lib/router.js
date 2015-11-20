var express = require('express');
var router = express.Router();

router.get('/ping', function (req, res, next)
{
    res.end('OK');
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/admin/login');
});

/* todo. */
router.get('/admin/login', function (req, res, next) {
  res.render('admin/auto/login');
});
router.post('/admin/login', function (req, res, next) {
  res.redirect('/admin');
});
router.get('/admin', function (req, res, next) {
  res.render('admin/index', { context: { menu: 'admin_index' } });
});
router.get('/admin/ads', function (req, res, next) {
  res.render('admin/ads/list', { context: { menu: 'admin_ads' } });
});
router.get('/admin/message', function (req, res, next) {
  res.render('admin/message/list', { context: { menu: 'admin_message' } });
});
router.get('/admin/post', function (req, res, next) {
  res.render('admin/post/list', { context: { menu: 'admin_post' } });
});
router.get('/admin/stat', function (req, res, next) {
  res.render('admin/stat/details', { context: { menu: 'admin_stat' } });
});
router.get('/admin/system', function (req, res, next) {
  res.render('admin/system/details', { context: { menu: 'admin_system' } });
});
router.get('/admin/tag', function (req, res, next) {
  res.render('admin/tag/list', { context: { menu: 'admin_tag' } });
});
router.get('/admin/user', function (req, res, next) {
  res.render('admin/user/list', { context: { menu: 'admin_user' } });
});
module.exports = router;
