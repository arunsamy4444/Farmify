const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

const app = express();
// ✅ CORS Setup: Only allow frontend from Vercel or localhost
const allowedOrigins = [
  'https://farmify-tau.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static("uploads"));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/buyer', buyerRoutes);
app.use('/payment', paymentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

