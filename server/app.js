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

// ✅ Updated CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://farmify-delta.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked: ${origin}`);
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Serve static files (images, uploads, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Route setup
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/buyer', buyerRoutes);
app.use('/payment', paymentRoutes);

// ✅ Default route (for testing)
app.get('/', (req, res) => {
  res.send('🌱 Farmify API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
