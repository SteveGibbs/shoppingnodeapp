/**
 * Created by carolineperier on 14/05/2017.
 */
var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');



var products = [
    new Product({
        imagePath: '../images/alps.jpg',
        title: 'Switzerland',
        description: 'Mountains and yodelling',
        price: 10
    }),
    new Product({
        imagePath: '../images/alps.jpg',
        title: 'France',
        description: 'Mountains and cheese',
        price: 6
    }),
    new Product({
        imagePath: '../images/alps.jpg',
        title: 'Australia',
        description: 'Surf and turf',
        price: 1
    }),
    new Product({
        imagePath: '../images/alps.jpg',
        title: 'France',
        description: 'Mountains',
        price: 3
    })
];

var done = 0;

for (var i=0; i<products.length; i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}