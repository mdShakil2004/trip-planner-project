const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Group Chat' },
  inviteLink: { type: String, required: true, unique: true },
  members: [{ type: String }], // Array of userIds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);