require('dotenv').config(); // Must be the first line

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const apiRouter = require('./Routes/index'); // This is fine

const orderRoutes = require('./Routes/orders');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true, // Enable credentials for cookies
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(cookieParser());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api', apiRouter); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/heritagehands';

console.log('Environment variables:');
console.log('PORT:', PORT);
console.log('MONGO_URI:', MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Please make sure MongoDB is running on your system');
    process.exit(1);
  });
