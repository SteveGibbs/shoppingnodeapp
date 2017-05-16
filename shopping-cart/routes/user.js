var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection); //protects the routes using csrfProtection

router.get('/profile', isLoggedIn, function(req, res, next){
    res.render('user/profile');
});  //order is important

router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();  //method added by passport
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
    next();
});
//notLoggedIn is checked first and so placed in front of all the routes where we allow them to see the route if they are not logged in.
router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next){ //if success then continue to this third function
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);

    } else {
        res.redirect('/user/profile'); //deals with case of user not coming from checkout - so just signs in and
        // and gets directed to user profile page
    }
});

router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
    //Code below for customer if they go to checkout but are not logged in - they are redirected to user/signin
    // but after signin they go back to the checkout (so need old url)
}), function(req, res, next){ //if success then continue to this third function
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);

    } else {
        res.redirect('/user/profile'); //deals with case of user not coming from checkout - so just signs in and
        // and gets directed to user profile page
    }
});


module.exports = router;

//middleware so that only authenticated users can reach certain routes
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

//and for the opposite so that only not logged in users can reach certain routes
function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}