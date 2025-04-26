import UserOTPModel from "../models/UserOTPModel.js";
import { DecodeToken } from "../utility/TokenHelper.js";

export const protect = async (req, res, next) => {
  // Get token from headers or cookies
  let token = req.headers['token'];
  if (!token) {
    token = req.cookies['token'];
  }
  
  // If no token found in authorization header with Bearer format
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'You are not logged in. Please log in to get access.'
    });
  }

  // Token Decode
  let decoded = DecodeToken(token);

  if (decoded === null) {
    return res.status(401).json({ 
      status: false, 
      message: "Authentication failed. Invalid token." 
    });
  }
  
  try {
   // 3) Check if user still exists
    const currentUser = await UserOTPModel.findOne({ email: decoded.email });
    if (!currentUser) {
      return res.status(401).json({
        status: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user is banned
    if (currentUser.isBanned) {
      return res.status(403).json({
        status: false,
        message: 'Your account has been banned. Please contact support.'
      });
    }
    
    // Set user information in request headers
    req.headers.user_id = decoded.id;
    req.headers.email = decoded.email;
    req.headers.role = decoded.role;
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error verifying user authentication.'
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin', 'dist-coordinator', etc]
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
}; 