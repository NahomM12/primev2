const express = require("express");
const {
  register,
  login,
  getAllUsers,
  editUser,
  getRegionProperties,
} = require("../controllers/managerCtrl");
const {
  authMiddleware,
  managerMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", getAllUsers);
router.put("/edit-users/:id", editUser);
router.get("/region-properties", managerMiddleware, getRegionProperties);

module.exports = router;
