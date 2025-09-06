const express = require("express");
const { createNotification } = require("../controllers/notificationController");

const router = express.Router();

// Route to send a notification
router.post("/send", createNotification);

module.exports = router;
