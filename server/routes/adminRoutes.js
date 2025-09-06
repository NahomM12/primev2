const express = require("express");
const {
  register,
  login,
  getAllUsers,
  deleteUser,
  getAllManagers,
  deleteManager,
  addManager,
  changeProfile,
  updatePassword,
} = require("../controllers/adminCtrl");
const { adminMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.get("/all-users", getAllUsers);
router.delete("/delete-user/:id", deleteUser);
router.get("/all-managers", getAllManagers);
router.delete("/delete-manager/:id", deleteManager);
router.post("/add-manager", addManager);
router.put("/update-profile", adminMiddleware, changeProfile);
router.put("/update-password", adminMiddleware, updatePassword);

module.exports = router;
