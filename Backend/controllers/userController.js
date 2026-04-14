const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get user by ID
const getUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error getting user" });
  }
};

// ✅ Update user by ID (admin)
const updateUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const updateData = { ...req.body };
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ✅ Update own profile
const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// ✅ Delete user by ID (admin)
const deleteUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// ✅ Delete own account
const deleteOwnAccount = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Your account has been deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};

// ✅ Get total user stats
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

// ✅ PATCH: Update user role (admin only)
const patchUserRoleById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateOwnProfile,
  deleteOwnAccount,
  getUserStats,
  patchUserRoleById, // ✅ Exported new method
};
