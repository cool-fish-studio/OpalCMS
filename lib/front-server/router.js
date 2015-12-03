'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var frontController = require('./controller');

/**
 * 路由转发
 */
/* GET home page. */
router.get('/message', function (req, res, next) {
  res.render('message', { context: { menu: 'message', isShowBanner: true } });
});

router.get('/:type?', frontController.viewList);
router.get('/:type/:contentID', frontController.viewInfo);


module.exports = router;