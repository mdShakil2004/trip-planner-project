const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  avatar: { type: String, default: 'http://localhost:5000/uploads/default-avatar.jpg' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);