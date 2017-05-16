var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');


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
