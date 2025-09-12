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
const User = require("../models/userModel");
const notificationMessageBroker = require("../services/notificationMessageBroker");

const createNotification = async (req, res) => {
  const { title, body, recipient, messageType, relatedProperty } = req.body;

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

const sendInAppNotification = async ({
  title,
  body,
  recipient,
  messageType,
  relatedProperty,
}) => {
  try {
    if (!title || !body || !recipient) {
      throw new Error("Title, body, and recipient are required.");
    }

    const user = await User.findById(recipient);
    if (!user) {
      throw new Error("Recipient user not found.");
    }

    const notification = await Notification.create({
      title,
      body,
      recipient: user._id,
      status: "sent",
      messageType,
      relatedProperty,
      createdAt: new Date(),
    });
    
    // Publish new notification event to RabbitMQ
    await notificationMessageBroker.publishNewNotification(notification, user._id);

    return notification;
  } catch (error) {
    console.error("Error sending in-app notification:", error);
    throw error;
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is available from authentication middleware

    const notifications = await Notification.find({
      recipient: id,
      messageType: {
        $in: [
          "property_status_change",
          "featured_property",
          "rejection",
          "approval",
          "boost",
        ],
      },
    })
      .sort({ createdAt: -1 })
      .populate("relatedProperty", "title");

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return res.status(500).json({
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // Publish notification read event to RabbitMQ
    await notificationMessageBroker.publishNotificationRead(id, req.user.id);
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // Publish notification delete event to RabbitMQ
    await notificationMessageBroker.publishNotificationDelete(id, req.user.id);
    
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from auth middleware
    const result = await Notification.deleteMany({ recipient: id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found to delete" });
    }
    
    // Publish delete all notifications event to RabbitMQ
    await notificationMessageBroker.publishDeleteAllNotifications(id, result.deletedCount);
    
    res.status(200).json({ 
      message: "All notifications deleted successfully",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  sendInAppNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
};
