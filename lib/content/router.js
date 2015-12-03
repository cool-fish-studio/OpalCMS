'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var contentController = require('./controller');

/**
 * 路由转发
 */
router.get('/:type?', 
    authMiddleware.adminPageIfNotLoggedIn, 
    contentController.viewList);

router.route('/:type/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn,
        contentController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn,
        contentController.applyCreate);

router.route('/:type/:contentID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        contentController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        contentController.applyRemove);

router.route('/:type/:contentID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        contentController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        contentController.applyUpdate);

module.exports = router;