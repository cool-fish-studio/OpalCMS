'use strict';

module.exports.homePageIfLogged = function(req, res, next)
{
    if (req.isAuthenticated()) 
        return res.redirect('/');

    next();
};

module.exports.adminPageIfLogged = function(req, res, next)
{
    if (req.isAuthenticated()) 
        return res.redirect('/admin');

    next();
};

module.exports.homePageIfNotLoggedIn = function (req, res, next)
{
    if (true !== req.isAuthenticated()) 
        return res.redirect('/');

    next();
};

module.exports.adminPageIfNotLoggedIn = function(req, res, next)
{
    if (true !== req.isAuthenticated()) 
        return res.redirect('/admin/signin');

    next();
};

module.exports.redirectIfNotAdmin = function (req, res, next)
{
    if (!req.user || req.user.role !== 'admin')
        return res.redirect('/');

    next();
};
