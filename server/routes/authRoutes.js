const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Ensure 'uploads/' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique file name
    }
});

const upload = multer({ storage });

// Signup route
router.post('/signup', upload.single('profilePic'), async (req, res) => {
    const { name, email, password, role } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            profilePic,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

       const token = jwt.sign({ id: user._id, role: user.role }, "supersecretjwtkey", { expiresIn: '30d' });


        res.status(201).json({ message: 'User created successfully', token, user });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, "supersecretjwtkey", { expiresIn: '30d' });
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout route (for client-side token removal)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;





// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Signup
// router.post('/signup', async (req, res) => {
//     const { name, profilePic, email, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ name, profilePic, email, password: hashedPassword, role });
//         await user.save();
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ error: 'User not found' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
//         res.status(200).json({ message: 'Login successful', token, user });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;