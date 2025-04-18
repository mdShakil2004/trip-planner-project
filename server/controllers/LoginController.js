// controllers/userController.js
const { userModel } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      success: true,
      message: 'Welcome again!',
      token,
      user: {_id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};






// Create user
const createUser = async (req, res) => {
  
  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }


  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {_id:user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
};


const getMe= async (req, res)=>{
  try {

    // console.log("req.user.id    ",req.user.id,req.body)
    const user = await userModel.findById(req.user.id).select("-password");




    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};





module.exports = { loginUser, createUser,getMe };