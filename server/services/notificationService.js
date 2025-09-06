// import axios from "axios";
// import { Notification } from "../models/notificationModel";

// const FCM_SERVER_URL = "https://fcm.googleapis.com/fcm/send";
// const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY; // Ensure to set your FCM server key in environment variables

// export const sendNotification = async (notificationData) => {
//   try {
//     const { title, body, recipient } = notificationData;

//     // Create notification object
//     const notification = {
//       to: recipient,
//       notification: {
//         title: title,
//         body: body,
//         sound: "default",
//       },
//       data: {
//         title: title,
//         body: body,
//       },
//     };

//     // Send notification using FCM
//     const response = await axios.post(FCM_SERVER_URL, notification, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `key=${FCM_SERVER_KEY}`,
//       },
//     });

//     // Log the notification in the database
//     await Notification.create({
//       title,
//       body,
//       recipient,
//       status: response.status === 200 ? "sent" : "failed",
//       sentAt: new Date(),
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw new Error("Notification could not be sent");
//   }
// };

const { Expo } = require("expo-server-sdk");
const Notification = require("../models/notificationModel");

// Create a new Expo SDK client
let expo = new Expo();

const sendNotification = async ({ title, body, recipient }) => {
  try {
    if (!Expo.isExpoPushToken(recipient)) {
      throw new Error("Invalid Expo push token");
    }

    const messages = [
      {
        to: recipient,
        sound: "default",
        title,
        body,
        data: { withSome: "data" }, // optional additional data
      },
    ];

    // Chunk messages to handle many recipients if needed
    const chunks = expo.chunkPushNotifications(messages);

    let tickets = [];

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    // Save notification with status
    await Notification.create({
      title,
      body,
      recipient,
      status: "sent",
      sentAt: new Date(),
    });

    return tickets;
  } catch (error) {
    console.error("Error sending notification:", error);
    await Notification.create({
      title,
      body,
      recipient,
      status: "failed",
      sentAt: new Date(),
    });
    throw error;
  }
};

module.exports = { sendNotification };
