// config/db.js with dotenv
const mongoose = require('mongoose');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../secure', '.env') }); // Load .env from the secure folder

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // console.log('Connected to MongoDB');
  } catch (error) {
    // console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;