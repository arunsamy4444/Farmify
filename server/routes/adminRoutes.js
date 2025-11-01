const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Required for folder checks
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Payment = require("../models/Payment");

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Middleware to check admin access
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};


// ✅ Get all users (Admin only)
router.get('/getallusers', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // hide password field
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: err.message });
    }
});


// ✅ Get all products (auto URL switch)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    const baseUrl = req.hostname.includes('localhost')
      ? `${req.protocol}://${req.get('host')}`
      : `https://farmify-api.onrender.com`;

    const updated = products.map(p => ({
      ...p._doc,
      picture: p.picture ? `${baseUrl}/uploads/${p.picture}` : null
    }));

    res.json({ products: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add Product with Image Upload
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

router.post('/products/add', authMiddleware, isAdmin, upload.single('picture'), async (req, res) => {
    const { name, quantity, pricePerKg, picture } = req.body;

    try {
        let finalFilename = '';

        // Case 1️⃣ — Admin uploaded a file manually
        if (req.file) {
            finalFilename = req.file.filename;
        }

        // Case 2️⃣ — Admin sent an image URL
        else if (picture && picture.startsWith('http')) {
            const response = await axios.get(picture, { responseType: 'arraybuffer' });
            const extension = path.extname(new URL(picture).pathname) || '.jpg';
            finalFilename = `${uuidv4()}${extension}`;
            const filePath = path.join(uploadDir, finalFilename);

            fs.writeFileSync(filePath, Buffer.from(response.data)); // Save to uploads/
        }

        // Case 3️⃣ — No picture at all
        else {
            return res.status(400).json({ error: 'Picture is required (upload or URL)' });
        }

        // ✅ Save product in DB with stored filename
        const product = new Product({
            name,
            quantity,
            pricePerKg,
            picture: finalFilename,
        });

        await product.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: {
                ...product._doc,
                picture: `${req.protocol}://${req.get('host')}/uploads/${finalFilename}`
            }
        });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: err.message });
    }
});


// Edit Product (including price per kg)
router.put('/editproduct/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
});


// Delete Product
router.delete('/deleteproduct/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/getorders', authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'products.product', // Populate the product inside the array
                model: 'Product' // Ensure it references the correct model
            })
            .populate('buyer'); // Populate buyer details

        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update Order Status
router.put('/editorders/:id', authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Admin - Get all successful payments (Protected Route)
router.get("/get/payments", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({ status: "success" }) // Get only successful payments
            .populate("userId", "name email") // Fetch user details (name, email)
            .sort({ createdAt: -1 }); // Sort by latest transactions

        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;