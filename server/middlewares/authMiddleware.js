const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header (format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token part after "Bearer"

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    // Attach the user ID to the request object
    req.userId = decoded.id; 
    next(); // Proceed to the next middleware or route handler 
  });
};

module.exports = { authenticateToken }; 