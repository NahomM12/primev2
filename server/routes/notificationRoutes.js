const express = require("express");
const {
  createNotification,
  //   getNotificationHistory,
} = require("../controllers/notificationController");

const router = express.Router();

// Route to send a notification
router.post("/send", createNotification);

// Route to retrieve notification history
// router.get("/history", getNotificationHistory);

module.exports = router;
