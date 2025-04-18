// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Unique ID
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  contentType: { type: String, enum: ["text", "image", "voice"], required: true },
  content: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Delivered" },
  groupId: { type: String, required: true }, // Add this
  replyTo: {
    id: { type: Number },
    userName: { type: String },
    content: { type: String },
  },
  readBy: [{ userId: String, timestamp: String }],
  deleted: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);