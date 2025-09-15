const mongoose = require("mongoose");

const systemCleanupSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["searchHistory"], // Add other types here in the future
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    retentionDays: {
      type: Number,
      default: 90,
      min: 1,
      max: 365,
    },
    schedule: {
      type: String,
      default: "0 3 * * *",
    },
    lastRun: {
      type: Date,
      default: null,
    },
    lastRunResult: {
      deletedCount: Number,
      success: Boolean,
      message: String,
    },
  },
  { timestamps: true }
);

// Create indexes for better performance
systemCleanupSchema.index({ type: 1 });
systemCleanupSchema.index({ enabled: 1 });

module.exports = mongoose.model("SystemCleanup", systemCleanupSchema);
