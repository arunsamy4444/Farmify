const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// Dummy Payment API (User ID in URL)
router.post('/pay/:userId/:orderId', authMiddleware, async (req, res) => {
    const { userId, orderId } = req.params; // Extract userId and orderId from URL
    const { amount, paymentMethod, transactionId } = req.body;

    try {
        // Find the order from the database using the orderId
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Create a new payment record with userId and order details
        const payment = new Payment({
            userId, // Store userId from URL params
            order: orderId, // Store orderId
            amount,
            status: 'success', // Assuming payment is successful for now
            paymentMethod,
            transactionId
        });

        // Save payment to database
        await payment.save();

        // Send success response
        res.status(200).json({ message: 'Payment successful (dummy)', payment });
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
