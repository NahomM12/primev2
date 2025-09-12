const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to send a notification
router.post("/send", createNotification);
router.get("/user-notifications", authMiddleware, getUserNotifications);
router.put("/read/:id", authMiddleware, markNotificationAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
