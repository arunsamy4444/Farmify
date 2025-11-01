const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


const app = express();
// ✅ CORS Setup: Only allow frontend from Vercel or localhost
const allowedOrigins = [
  'https://farmify-tau.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
<<<<<<< HEAD
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
=======
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

>>>>>>> 71880c96e48d2022e1446f8f5e7ff7c6964f7c1b

app.use(express.json());

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static("uploads"));


// ✅ Mongo connection (local)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected locally'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/buyer', buyerRoutes);
app.use('/payment', paymentRoutes);

<<<<<<< HEAD
// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
=======
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

>>>>>>> 71880c96e48d2022e1446f8f5e7ff7c6964f7c1b
