'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var fileController = require('./controller');

/**
 * 路由转发
 */
router.post('/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    fileController.applyUpload);

module.exports = router;