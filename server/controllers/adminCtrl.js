const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const { generateRefreshToken } = require("../config/refreshToken");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Manager = require("../models/managerModel");
const Transaction = require("../models/transactionModel");
const bcrypt = require("bcryptjs");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin) throw new Error("admin already exists");
    const newAdmin = await Admin.create({
      name,
      email,
      password,
    });
    res.json(newAdmin);
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    console.log(user);
    if (!user) throw new Error("user doesn't exists");
    if (user && (await user.isPasswordMatched(password))) {
      const refreshToken = generateRefreshToken(user._id);
      const updateduser = await Admin.findByIdAndUpdate(
        user._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      });

      const accessToken = generateToken(user._id);

      res.json({
        message: "logged in successfully",
        _id: updateduser?._id,
        name: updateduser?.name,
        email: updateduser?.email,
        preference: updateduser?.preference,
        seller_tab: updateduser?.seller_tab,
        token: accessToken,
      });
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

const changeProfile = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  console.log(req.admin);
  // const { id } = req.params;
  try {
    const user = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Current password, new password, and confirm password are required",
    });
  }

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match",
    });
  }

  // Check if new password is different from current password
  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password",
    });
  }

  try {
    // Find admin and verify current password
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.isPasswordMatched(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
      { new: true }
    ).select("-password -refreshToken");

    res.json({
      success: true,
      message: "Password updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating password",
      details: error.message,
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteManager = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { id } = req.params;
  try {
    const manager = await Manager.findByIdAndDelete(id);
    res.json(manager);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllManagers = asyncHandler(async (req, res) => {
  try {
    const users = await Manager.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

const getSaleTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.find({ transactionType: "sell" })
      .populate({
        path: "property",
        select: "title -_id",
      })
      .populate({
        path: "buyer",
        select: "name -_id",
      })
      .populate({
        path: "seller",
        select: "name -_id",
      });
    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

const getRentTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.find({ transactionType: "rent" })
      .populate({
        path: "property",
        select: "title -_id",
      })
      .populate({
        path: "buyer",
        select: "name -_id",
      })
      .populate({
        path: "seller",
        select: "name -_id",
      });
    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

const addManager = asyncHandler(async (req, res) => {
  const { name, email, phone, password, region_id, subregion_id } = req.body;
  console.log(req.body);

  try {
    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const manager = await Manager.create({
      name,
      email,
      phone,
      password,
      region_id,
      subregion_id,
    });

    // await manager.save();
    return res
      .status(201)
      .json({ message: "Manager created successfully", manager });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  register,
  login,
  getAllUsers,
  deleteUser,
  getAllManagers,
  deleteManager,
  getSaleTransaction,
  getRentTransaction,
  addManager,
  changeProfile,
  updatePassword,
};
