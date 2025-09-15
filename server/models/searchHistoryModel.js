const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient cleanup queries
searchHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
