import userModel from "../models/UserModel.js";
import UserOTPModel from "../models/UserOTPModel.js";
import { DecodeToken } from "../utility/TokenHelper.js";

// Authentication Middleware
export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header, cookie or bearer auth
    let token = req.headers['token'] || req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2. Decode token
    const decoded = DecodeToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: false,
        message: 'Authentication failed. Invalid token.',
      });
    }

    // 3. Try to find user in userModel (registered users)
    const registeredUser = await userModel.findById(decoded.id);

    if (registeredUser) {
      // 4. Check role match
      if (registeredUser.role !== decoded.role) {
        return res.status(403).json({
          status: false,
          message: 'You are not authorized to access this resource.',
        });
      }

      // 5. Set user info in request
      req.user = {
        id: registeredUser._id,
        email: registeredUser.email,
        role: registeredUser.role,
      };

      // 6. Set user info in request headers
      req.headers.user_id = registeredUser._id;
      req.headers.user_email = registeredUser.email;
      req.headers.user_role = registeredUser.role;

      return next();
    }

    // 6. If not in userModel, fallback to UserOTPModel
    const otpUser = await UserOTPModel.findOne({ email: decoded.email });

    if (!otpUser) {
      return res.status(401).json({
        status: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (otpUser.isBanned) {
      return res.status(403).json({
        status: false,
        message: 'Your account has been banned. Please contact support.',
      });
    }

    // 7. Set otpUser info in request
    req.user = {
      id: otpUser._id,
      email: otpUser.email,
      role: decoded.role,
    };

    next();

  } catch (error) {
    console.error('Protect middleware error:', error);
    return res.status(500).json({
      status: false,
      message: 'Error verifying user authentication.',
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        status: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
