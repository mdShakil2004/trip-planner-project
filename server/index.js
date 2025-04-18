// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db'); // Import DB connection
const { setupWebSocket } = require('./utils/websocket');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoute = require('./routes/tripRoute');

const dotenv = require('dotenv')
dotenv.config({path:'./secure/.env'})



const app = express();

// public folder 

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));



// routes for local data 
app.use('/user', userRoutes);
app.use('/trips', tripRoute);


// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Generate a unique group invite link
let groupInviteCode = Math.random().toString(36).substring(2, 10); // Simple random code
const groupInviteLink = `http://localhost:5000/join/${groupInviteCode}`;

// Routes
app.use('/api', chatRoutes);

// print hello
app.get("/hello",(req,res)=>{
  res.send("Hello from server");
})


// Endpoint to get the invite link
app.get('/api/invite-link', (req, res) => {
  res.json({ inviteLink: groupInviteLink });
});

// Endpoint to join via invite link
app.get('/join/:code', (req, res) => {
  const { code } = req.params;
  if (code === groupInviteCode) {
    res.send('Welcome to the group! Open the chat app to join.');
  } else {
    res.status(404).send('Invalid invite link');
  }
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 8000;
const startServer = async () => {
  await connectDB(); // Connect to MongoDB before starting server
  setupWebSocket(server); // Setup WebSocket after DB connection
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();