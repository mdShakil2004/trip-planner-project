// controllers/chatController.js
const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');
const UserAvatar = require('../models/UserAvatar');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const uploadFile = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  }
];

const uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No avatar uploaded' });
    }
    const avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    try {
      await UserAvatar.findOneAndUpdate(
        { userId },
        { avatarUrl },
        { upsert: true, new: true }
      );
      res.json({ url: avatarUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  }
];

const getAvatar = async (req, res) => {
  const userId = req.params.userId;
 
  try {
    const userAvatar = await UserAvatar.findOne({ userId });
    const avatar = userAvatar ? userAvatar.avatarUrl : 'http://localhost:5000/uploads/default-avatar.jpg';
    res.json({ url: avatar });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch avatar' });
  }
};

const addMessage = async (message) => {
  try {
    const newMessage = new Message(message);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw error;
  }
};

const getAllMessages = async () => {
  try {
    return await Message.find().sort({ timestamp: 1 });
  } catch (error) {
    return [];
  }
};

module.exports = {
  getMessages,
  uploadFile,
  uploadAvatar,
  getAvatar,
  addMessage,
  getAllMessages
};