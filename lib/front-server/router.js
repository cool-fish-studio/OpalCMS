'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var frontController = require('./controller');

/**
 * 路由转发
 */
router.route('/message')
    .get(
        frontController.viewMessage)
    .post(
        frontController.applyMessage);

router.get('/:type?', frontController.viewList);
router.get('/:type/:contentID', frontController.viewInfo);


module.exports = router;