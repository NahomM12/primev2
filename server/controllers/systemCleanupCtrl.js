const asyncHandler = require("express-async-handler");
const {
  getAllCleanupConfigs,
  updateCleanupConfig,
  performCleanup,
} = require("../utils/systemCleanup");
const SearchHistory = require("../models/searchHistoryModel");

/**
 * Get the current cleanup configuration and status.
 * @route GET /api/v1/system/search-history/status
 * @access Admin
 */
const getAllCleanupStatus = asyncHandler(async (req, res) => {
  try {
    const configs = await getAllCleanupConfigs();
    res.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    console.error("Error getting all cleanup status:", error);
    res.status(500).json({
      success: false,
      message: "Error getting cleanup status",
      error: error.message,
    });
  }
});

/**
 * Update the cleanup configuration.
 * @route PUT /api/v1/system/search-history/config/:type
 * @access Admin
 */
const updateConfiguration = asyncHandler(async (req, res) => {
  try {
    const { type } = req.params;
    const { enabled, retentionDays, schedule } = req.body;

    // Validate type
    if (type !== "searchHistory") {
      return res.status(400).json({
        success: false,
        message: "Invalid cleanup type. Must be 'searchHistory'",
      });
    }

    // Validate retention days
    if (retentionDays && (retentionDays < 1 || retentionDays > 365)) {
      return res.status(400).json({
        success: false,
        message: "Retention days must be between 1 and 365",
      });
    }

    // Update the cleanup configuration
    const configUpdate = { enabled, retentionDays };
    if (schedule !== undefined) {
      configUpdate.schedule = schedule;
    }

    const updatedConfig = await updateCleanupConfig(type, configUpdate);

    res.json({
      success: true,
      message: `${type} cleanup configuration updated successfully.`,
      data: {
        config: updatedConfig,
      },
    });
  } catch (error) {
    console.error("Error updating cleanup configuration:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cleanup configuration",
      error: error.message,
    });
  }
});

/**
 * Manually trigger a cleanup run.
 * @route POST /api/v1/system/search-history/run/:type
 * @access Admin
 */
const runManualCleanup = asyncHandler(async (req, res) => {
  try {
    const { type } = req.params;

    // Validate type
    if (type !== "searchHistory") {
      return res.status(400).json({
        success: false,
        message: "Invalid cleanup type. Must be 'searchHistory'",
      });
    }

    // Run cleanup
    const result = await performCleanup(type);

    res.json({
      success: true,
      message: `Manual ${type} cleanup completed`,
      data: result,
    });
  } catch (error) {
    console.error("Error running manual cleanup:", error);
    res.status(500).json({
      success: false,
      message: "Error running manual cleanup",
      error: error.message,
    });
  }
});

/**
 * Get statistics about the SearchHistory collection.
 * @route GET /api/v1/system/search-history/stats
 * @access Admin
 */
const getStatistics = asyncHandler(async (req, res) => {
  try {
    const count = await SearchHistory.countDocuments();
    const oldest = await SearchHistory.findOne()
      .sort({ createdAt: 1 })
      .select("createdAt");
    const newest = await SearchHistory.findOne()
      .sort({ createdAt: -1 })
      .select("createdAt");

    // Rough estimate: average size of a search history document in bytes
    const avgDocSize = 150;
    const estimatedSizeMB = ((count * avgDocSize) / 1024 / 1024).toFixed(2);

    const stats = {
      searchHistory: {
        count,
        oldestDate: oldest?.createdAt || null,
        newestDate: newest?.createdAt || null,
        estimatedSize: `${estimatedSizeMB} MB`,
      },
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error getting cleanup stats:", error);
    res.status(500).json({
      success: false,
      message: "Error getting cleanup stats",
      error: error.message,
    });
  }
});

module.exports = {
  getAllCleanupStatus,
  updateConfiguration,
  runManualCleanup,
  getStatistics,
};
