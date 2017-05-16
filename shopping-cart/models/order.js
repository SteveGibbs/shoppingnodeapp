/**
 * Created by carolineperier on 14/05/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema ({
    user: {type: Schema.Types.ObjectId, ref: 'User'}, //store id from the user model
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);
