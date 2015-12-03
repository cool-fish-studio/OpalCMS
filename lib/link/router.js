'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var linkController = require('./controller');

/**
 * 路由转发
 */
router.get('/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    linkController.viewList);

router.route('/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        linkController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        linkController.applyCreate);

router.route('/:linkID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        linkController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        linkController.applyRemove);

router.route('/:linkID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        linkController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        linkController.applyUpdate);

module.exports = router;