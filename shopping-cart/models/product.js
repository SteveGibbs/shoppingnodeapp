/**
 * Created by stevegibbs on 14/05/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema ({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    highlights: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Product', schema);
