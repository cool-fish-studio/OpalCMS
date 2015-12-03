'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../middleware/auth');
var categoryController = require('./controller');

/**
 * 路由转发
 */
router.get('/', 
    authMiddleware.adminPageIfNotLoggedIn, 
    categoryController.viewList);

router.route('/create')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        categoryController.viewCreate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        categoryController.applyCreate);

router.route('/:categoryID/remove')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        categoryController.viewRemove)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        categoryController.applyRemove);

router.route('/:categoryID/update')
    .get(
        authMiddleware.adminPageIfNotLoggedIn, 
        categoryController.viewUpdate)
    .post( 
        authMiddleware.adminPageIfNotLoggedIn, 
        categoryController.applyUpdate);

module.exports = router;