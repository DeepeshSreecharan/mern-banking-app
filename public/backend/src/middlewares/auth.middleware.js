const { verifyToken } = require('../utils/jwt.service');
const User = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No authorization header provided.' 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Invalid authorization format. Use Bearer token.' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token || token.trim().length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    try {
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token payload.' 
        });
      }

      // Check if user still exists and fetch user data
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Token is valid but user no longer exists.' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: 'User account is deactivated.' 
        });
      }

      // Attach user data to request
      req.userId = decoded.userId;
      req.user = user;
      req.userRole = user.role || 'user';
      
      next();
    } catch (jwtError) {
      let errorMessage = 'Token verification failed.';
      
      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired. Please login again.';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format.';
      } else if (jwtError.name === 'NotBeforeError') {
        errorMessage = 'Token not active yet.';
      }

      return res.status(401).json({ 
        success: false,
        message: errorMessage 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required.' 
      });
    }

    if (!req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error in authorization.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Optional: Rate limiting middleware for sensitive operations
const sensitiveOperationMiddleware = (req, res, next) => {
  // Add additional checks for sensitive operations like transfers
  const userAgent = req.get('User-Agent');
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Log sensitive operations
  console.log(`Sensitive operation: ${req.method} ${req.path} - User: ${req.userId} - IP: ${clientIP} - UA: ${userAgent}`);
  
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  sensitiveOperationMiddleware
};