'use strict';

var express = require('express');
var router = express.Router();

var userController = require('./controller');

/**
 * 路由转发
 */

// router.post('/', userController.insert);

// router.get('/all', userController.findAll);

// router.get('/:userID', userController.getByID);

//邮件激活

module.exports = router;