const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    picture: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerKg: { type: Number, required: true } // Added price per kg
});

module.exports = mongoose.model('Product', productSchema);