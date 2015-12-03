'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var adController = require('./controller');

/**
 * 路由转发
 */
router.get('/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    adController.viewList);

router.route('/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        adController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        adController.applyCreate);

router.route('/:adID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        adController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        adController.applyRemove);

router.route('/:adID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        adController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        adController.applyUpdate);

module.exports = router;