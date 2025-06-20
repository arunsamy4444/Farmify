const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Product', 
                    required: true 
                },
                productName: { 
                    type: String, 
                    required: true, 
                    trim: true 
                }, // Added product name field
                quantity: { 
                    type: Number, 
                    required: true, 
                    min: [1, 'Quantity must be at least 1'] 
                },
                pricePerKg: { 
                    type: Number, 
                    required: true,
                    min: [0, 'Price per kg must be a positive number']
                } 
            }
        ],
        address: {
            taluk: { type: String, required: true, trim: true },
            district: { type: String, required: true, trim: true },
            pincode: { 
                type: String, 
                required: true, 
                match: [/^\d{6}$/, 'Invalid pincode format'] 
            },
            villageTown: { type: String, required: true, trim: true }
        },
        buyer: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        status: { 
            type: String, 
            default: 'pending', 
            enum: ['pending', 'shipped', 'delivered', 'cancelled'] 
        }
    }, 
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     products: [
//         {
//             product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//             quantity: { type: Number, required: true }
//         }
//     ],
//     address: {
//         taluk: { type: String, required: true },
//         district: { type: String, required: true },
//         pincode: { type: String, required: true },
//         villageTown: { type: String, required: true }
//     },
//     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     status: { type: String, default: 'pending' }
// }, { timestamps: true });

// const Order = mongoose.model('Order', orderSchema);
// module.exports = Order;
