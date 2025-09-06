// import Notification from "../models/notificationModel";
// import { sendNotification } from "../services/notificationService";

// // Function to send a notification
// export const createNotification = async (req, res) => {
//   const { title, body, recipient } = req.body;

//   try {
//     // Validate input
//     if (!title || !body || !recipient) {
//       return res
//         .status(400)
//         .json({ message: "Title, body, and recipient are required." });
//     }

//     // Create notification in the database
//     const notification = await Notification.create({
//       title,
//       body,
//       recipient,
//       status: "sent",
//       createdAt: new Date(),
//     });

//     // Send the notification
//     await sendNotification(recipient, title, body);

//     return res
//       .status(201)
//       .json({ message: "Notification sent successfully.", notification });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to send notification.", error: error.message });
//   }
// };

// // Function to retrieve notification history
// export const getNotificationHistory = async (req, res) => {
//   const { recipient } = req.params;

//   try {
//     const notifications = await Notification.find({ recipient }).sort({
//       createdAt: -1,
//     });
//     return res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error retrieving notifications:", error);
//     return res
//       .status(500)
//       .json({
//         message: "Failed to retrieve notifications.",
//         error: error.message,
//       });
//   }
// };

// import Notification from "../models/notificationModel";
// import { sendNotification } from "../services/notificationService";

// export const createNotification = async (req, res) => {
//   const { title, body, recipient } = req.body;

//   try {
//     if (!title || !body || !recipient) {
//       return res
//         .status(400)
//         .json({ message: "Title, body, and recipient are required." });
//     }

//     // Create notification in DB - status pending initially (optional)
//     const notification = await Notification.create({
//       title,
//       body,
//       recipient,
//       status: "pending",
//       createdAt: new Date(),
//     });

//     // Send notification via Expo SDK
//     await sendNotification({ title, body, recipient });

//     // You can update status to 'sent' inside sendNotification or here if preferred

//     return res
//       .status(201)
//       .json({ message: "Notification sent successfully.", notification });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to send notification.", error: error.message });
//   }
// };

const Notification = require("../models/notificationModel");
const { sendNotification } = require("../services/notificationService");
const User = require("../models/userModel"); // <-- Add this

const createNotification = async (req, res) => {
  const { title, body, recipient } = req.body;

  try {
    if (!title || !body || !recipient) {
      return res
        .status(400)
        .json({ message: "Title, body, and recipient are required." });
    }

    // Find recipient user and get pushToken
    const user = await User.findById(recipient);
    if (!user || !user.pushToken) {
      return res
        .status(404)
        .json({ message: "Recipient push token not found" });
    }

    // Create notification in DB
    const notification = await Notification.create({
      title,
      body,
      recipient: user._id,
      status: "pending",
      createdAt: new Date(),
    });

    // Send notification via Expo SDK
    await sendNotification({ title, body, recipient: user.pushToken });

    return res
      .status(201)
      .json({ message: "Notification sent successfully.", notification });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res
      .status(500)
      .json({ message: "Failed to send notification.", error: error.message });
  }
};

module.exports = { createNotification };
