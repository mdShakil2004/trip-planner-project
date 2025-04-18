// models/UserAvatar.js
const mongoose = require('mongoose');

const userAvatarSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: 'http://localhost:5000/uploads/default-avatar.jpg' }
});

module.exports = mongoose.model('UserAvatar', userAvatarSchema);