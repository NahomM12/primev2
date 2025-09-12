const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "failed", "pending"],
    default: "pending",
  },
  messageType: {
    type: String,
    enum: ["rejection", "approval", "featured", "boost"],
    required: false,
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
