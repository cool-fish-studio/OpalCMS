'use strict';

var express = require('express');
var router = express.Router();

var authController = require('./controller');
var authMiddleware = require('../middleware/auth');

/**
 * 路由转发
 */

router.get('/activate/:email/:pwdTime', authController.activate);

router.post('/signup', authMiddleware.adminPageIfLogged, authController.signup);

router.post('/signin', authMiddleware.adminPageIfLogged, authController.signin);

router.get('/signout', authController.signout);

module.exports = router;