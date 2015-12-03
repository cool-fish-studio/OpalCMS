'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var tagController = require('./controller');

/**
 * 路由转发
 */
router.get('/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    tagController.viewList);

router.route('/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        tagController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        tagController.applyCreate);

router.route('/:tagID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        tagController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        tagController.applyRemove);

router.route('/:tagID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        tagController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        tagController.applyUpdate);

module.exports = router;