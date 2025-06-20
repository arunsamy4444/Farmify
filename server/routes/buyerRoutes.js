const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch All Products (available to everyone)
router.get('/getallproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Orders Placed (fetch orders placed by a specific user)
router.get('/getorder/:id', authMiddleware, async (req, res) => {
    const { id } = req.params; // Get user ID from route parameter
    console.log(id);
    
    try {
        // Fetch orders where the buyer matches the ID in the route
        const orders = await Order.find({ buyer: id })
            .populate({
                path: 'products.product', // Populate the product inside the array
                select: 'name picture' // Select only name and picture fields
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/placeorder', authMiddleware, async (req, res) => {
    const { orderItems, address } = req.body;

    // ✅ Debugging logs
    console.log("Received Order Items:", orderItems);
    if (orderItems.length > 0) {
        console.log("First Product Object:", orderItems[0].productId);  // 🛠️ FIXED: Logging correct field
    }

    try {
        // Validate input
        if (!orderItems || orderItems.length === 0 || !address || !address.taluk || !address.district || !address.pincode || !address.villageTown) {
            return res.status(400).json({ error: "Order items and address are required." });
        }

        // Validate all product IDs before proceeding
        for (let item of orderItems) {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {  // 🛠️ FIXED: Corrected field name
                return res.status(400).json({ error: `Invalid product ID: ${item.productId}` });
            }
        }

        // Fetch product prices per kg
        const productIds = orderItems.map(item => item.productId);
        const productsData = await Product.find({ _id: { $in: productIds } }).select('pricePerKg');

        // Create a single order document
        const order = new Order({
            products: orderItems.map(item => {
                const product = productsData.find(p => p._id.equals(item.productId));

                return {
                    product: new mongoose.Types.ObjectId(item.productId),
                    productName: item.productName,
                    quantity: item.quantity,
                    pricePerKg: product ? product.pricePerKg : 0 // ✅ Added pricePerKg
                };
            }),
            address,
            buyer: req.user.id,
            status: 'pending'
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });

    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ error: err.message });
    }
});


// Edit Order - Buyer can update status to 'shipped' or 'delivered'
router.put('/editorder/:orderId', authMiddleware, async (req, res) => {
    const { orderId } = req.params;
    const { quantity, address, status } = req.body;

    // Validate allowed status values for the buyer
    const allowedStatuses = ['shipped', 'delivered'];
    
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}` });
    }
    
    try {
        const order = await Order.findOneAndUpdate(
            { _id: orderId, buyer: req.user.id, status: { $in: ['pending', 'shipped'] } },
            { quantity, address, status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found or not authorized, or status cannot be updated.' });
        }
        
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Order
router.delete('/deleteorder/:orderId', authMiddleware, async (req, res) => {
    const { orderId } = req.params;
    
    try {
        const order = await Order.findOneAndDelete({ _id: orderId, buyer: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or not authorized' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
