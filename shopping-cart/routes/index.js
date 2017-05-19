var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
//var mongoose = require('mongoose');
var Product = require('../models/product');
var Order = require('../models/order');
var objectId = require('mongodb').ObjectID;  // mongo ID is an object ID not a string ID.
var assert = require('assert');
var url = 'localhost:27017/shopping';



/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    });
});

router.get('/get-data/:id', function(req, res, next){
    var uniqueid = req.params.id;
    var result = {};
        //assert.equal(null, err);
        var getObject = function() {
            Product.findOne({'_id': objectId(uniqueid)}, function (err, doc) {
                //assert.equal(null, err);
                console.log('item found');
                console.log(uniqueid);
                console.log(doc);
                console.log(doc.title);
                result = doc;
                res.render('shop/show', {item: result});
            });
        };
        getObject();
        console.log("getObject function has been called");
});

router.post('/insert', function(req, res, next) {
    var item = {
        title: req.body.title,
        description: req.body.description,
        imagePath: req.body.imagePath,
        price: req.body.price
    };
    var products = new Product(item);
    var insertObject = function() {
        //assert.equal(null, err);
        products.save(item, function (err, result) {
            assert.equal(null, err);
            console.log('item inserted');
            res.redirect('/');
        });

    };
    insertObject();
});

router.post('/update', function(req, res, next){

    var item = {
        title: req.body.title,
        description: req.body.description,
        imagePath: req.body.imagePath,
        price: req.body.price
    };

    var id = req.body.id;

    var editObject = function() {
        //assert.equal(null, err);
        //pass the id into the objectId function to transform it into an objectId that Mongo recognises as the
        // first parameter then use $set to say what the new data should be
        //$set just updates only the selected fields;
        Product.updateOne({'_id': objectId(id)}, {$set: item}, function (err, result) {
            assert.equal(null, err);
            console.log('item updated');
            res.redirect('/');

        });
    }
editObject();

});


router.post('/delete', function(req, res, next){
    var id = req.body.id;

    var deleteObject = function() {
        //assert.equal(null, err);
        Product.deleteOne({'_id': objectId(id)}, function (err, result) {
            assert.equal(null, err);
            console.log('item deleted');
            res.redirect('/');

        });
    }
    deleteObject();
});


router.get('/add-to-cart/:id', function(req, res, next){
   var productId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart : {items: {}}); //if there is a new cart pass it the cart otherwise pass it an empty object

    Product.findById(productId, function(err, product){
        if(err){
            return res.redirect('/');

        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');

    })
});

router.get('/reduce/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', isLoggedIn, function(req, res, next){
   if(!req.session.cart){
       return res.redirect('/shopping-cart');
   }
   var cart = new Cart(req.session.cart);
   var errMsg = req.flash('error')[0];
   res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next){
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    };

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_cvI6WG4C5yKQmkfIQ6rwX1gn"
    );

    stripe.charges.create({
        amount: cart.totalPrice *100,
        currency: "aud",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        // asynchronously called
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,  //whenever passport authenticates it makes a user object available throughout whole application
            cart: cart,
            address: req.body.address, // the request body stores the address value in the name field
            name: req.body.name,
            paymentId: charge.id //payment id comes from the charge object passed into the function - see stripe documentation
        });
        order.save(function(err, result){
            //can add error handling here
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

//middleware so that only authenticated users can reach certain routes
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

//and for the opposite so that only not logged in users can reach certain routes
function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;
