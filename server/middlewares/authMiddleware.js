const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Manager = require("../models/managerModel");
const Admin = require("../models/adminModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Retrieve the user based on the decoded token
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          next(); // Continue to the next middleware or route handler
        } else {
          throw new Error("User not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

const managerMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Retrieve the user based on the decoded token
        const user = await Manager.findById(decoded.id).select("-password");
        if (user) {
          req.manager = user;
          next(); // Continue to the next middleware or route handler
        } else {
          throw new Error("Manager not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

const adminMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Retrieve the user based on the decoded token
        const user = await Admin.findById(decoded.id).select("-password");
        if (user) {
          req.admin = user;
          next(); // Continue to the next middleware or route handler
        } else {
          throw new Error("Admin not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

const authOrAdminOrManagerMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Try to find as User
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        // Token might be for manager or admin, so don't throw yet
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Try to find as Manager
        const manager = await Manager.findById(decoded.id).select("-password");
        if (manager) {
          req.manager = manager;
          return next();
        }
      } catch (error) {
        // Token might be for admin, so don't throw yet
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Try to find as Admin
        const admin = await Admin.findById(decoded.id).select("-password");
        if (admin) {
          req.admin = admin;
          return next();
        }
      } catch (error) {
        // Token is invalid for all roles, or expired
      }
    }
  }
  throw new Error("Not authorized as an admin or manager or user");
});

const adminOrManagerMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Try to find as Manager
        const manager = await Manager.findById(decoded.id).select("-password");
        if (manager) {
          req.manager = manager;
          return next();
        }
      } catch (error) {
        // Token might be for admin, so don't throw yet
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Try to find as Admin
        const admin = await Admin.findById(decoded.id).select("-password");
        if (admin) {
          req.admin = admin;
          return next();
        }
      } catch (error) {
        // Token is invalid for admin
      }
    }
  }
  // If no token, or token invalid for manager/admin, throw error
  throw new Error("Not authorized as an admin or manager");
});

module.exports = {
  authMiddleware,
  managerMiddleware,
  adminMiddleware,
  authOrAdminOrManagerMiddleware,
  adminOrManagerMiddleware,
};
