'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var commentController = require('./controller');

/**
 * 路由转发
 */
router.get('/:contentID/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    commentController.viewList);

router.route('/:contentID/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        commentController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        commentController.applyCreate);

router.route('/:contentID/:commentID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        commentController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        commentController.applyRemove);

router.route('/:contentID/:commentID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        commentController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        commentController.applyUpdate);

module.exports = router;