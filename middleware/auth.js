const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authMiddleware = async (req, res, next) => {

  console.log("in middle ware");

  const authHeader = req.headers.authorization;

  console.log("authheader");
  console.log(authHeader);


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization token missing or malformed')
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password'); 
    if (!req.user) {
      console.log('User not found' )
      return res.status(401).json({ message: 'User not found' });
    }
  
    console.log("finieshed middle ware")
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
