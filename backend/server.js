// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// ✅ Proper CORS setup for local frontend
app.use(cors({
  origin: [
    "http://localhost:3000",                     // Local React dev server
    "https://merntodo-frontend.netlify.app" // Your Netlify domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Allow JWT token in header
  credentials: true
}));

app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
