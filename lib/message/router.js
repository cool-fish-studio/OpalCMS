'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var messageController = require('./controller');

/**
 * 路由转发
 */
router.get('/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    messageController.viewList);

router.route('/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        messageController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        messageController.applyCreate);

router.route('/:messageID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        messageController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        messageController.applyRemove);

router.route('/:messageID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        messageController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        messageController.applyUpdate);

module.exports = router;