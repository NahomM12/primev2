const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to send a notification
router.post("/send", createNotification);
router.get("/user-notifications", authMiddleware, getUserNotifications);
router.put("/read/:id", authMiddleware, markNotificationAsRead);
router.delete("/clear-all", authMiddleware, deleteAllNotifications);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
