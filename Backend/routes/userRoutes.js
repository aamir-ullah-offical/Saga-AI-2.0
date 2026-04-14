const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateOwnProfile,
  deleteOwnAccount,
  getUserStats,
  patchUserRoleById, // ✅ import
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// ✅ Own profile routes
router.put("/me/update", protect, updateOwnProfile);
router.delete("/me/delete", protect, deleteOwnAccount);

// ✅ Stats route
router.get("/stats/all", getUserStats);

// ✅ Edit role (admin only)
router.patch("/:id/role", protect, patchUserRoleById);

// ✅ Admin routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
