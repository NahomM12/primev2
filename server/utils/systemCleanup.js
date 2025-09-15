const cron = require("node-cron");
const SearchHistory = require("../models/searchHistoryModel");
const CleanupConfig = require("../models/systemCleanupModel");

// Store the cron job references
let cleanupJobs = {};

// Get model based on cleanup type
const getModelByType = (type) => {
  switch (type) {
    case "searchHistory":
      return SearchHistory;
    default:
      throw new Error(`Unknown cleanup type: ${type}`);
  }
};

// Get or create cleanup configuration from database
const getCleanupConfigFromDB = async (type) => {
  try {
    let config = await CleanupConfig.findOne({ type });

    if (!config) {
      // Create default configuration if it doesn't exist
      config = new CleanupConfig({
        type,
        enabled: false,
        retentionDays: 90, // Default retention
        schedule: "0 3 * * *", // Daily at 3 AM UTC
      });
      await config.save();
      console.log(`Created default ${type} cleanup configuration`);
    }

    return config;
  } catch (error) {
    console.error(`Error getting ${type} cleanup config from database:`, error);
    // Return default config if database error
    return {
      type,
      enabled: false,
      retentionDays: 90,
      schedule: "0 3 * * *",
      lastRun: null,
    };
  }
};

// Get all cleanup configurations
const getAllCleanupConfigs = async () => {
  try {
    const searchHistoryConfig = await getCleanupConfigFromDB("searchHistory");

    return {
      searchHistory: {
        ...searchHistoryConfig.toObject(),
        isRunning:
          cleanupJobs.searchHistory !== null &&
          cleanupJobs.searchHistory !== undefined,
      },
      // Add other configs here
    };
  } catch (error) {
    console.error("Error getting all cleanup configurations:", error);
    return {
      searchHistory: {
        type: "searchHistory",
        enabled: false,
        retentionDays: 90,
        schedule: "0 3 * * *",
        lastRun: null,
        isRunning: false,
      },
    };
  }
};

/**
 * Perform the actual cleanup of old logs
 */
const performCleanup = async (type) => {
  try {
    // Get current configuration from database
    const config = await getCleanupConfigFromDB(type);
    const Model = getModelByType(type);

    if (!config.enabled) {
      console.log(`${type} cleanup is disabled`);
      return { success: false, message: "Cleanup is disabled" };
    }

    console.log(
      `Starting automatic ${type} cleanup - retention: ${config.retentionDays} days`
    );

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);
    cutoffDate.setHours(0, 0, 0, 0); // Start of day

    console.log(`Deleting ${type} older than: ${cutoffDate.toISOString()}`);

    // Count logs that will be deleted
    const countToDelete = await Model.countDocuments({
      createdAt: { $lt: cutoffDate },
    });

    if (countToDelete === 0) {
      console.log(`No old ${type} found to delete`);

      // Update last run in database
      await CleanupConfig.findOneAndUpdate(
        { type },
        {
          lastRun: new Date(),
          lastRunResult: {
            deletedCount: 0,
            success: true,
            message: `No old ${type} to delete`,
          },
        }
      );

      return {
        success: true,
        message: `No old ${type} to delete`,
        deletedCount: 0,
        cutoffDate,
      };
    }

    // Delete old logs
    const result = await Model.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    // Update last run in database
    await CleanupConfig.findOneAndUpdate(
      { type },
      {
        lastRun: new Date(),
        lastRunResult: {
          deletedCount: result.deletedCount,
          success: true,
          message: `Automatic cleanup completed: ${result.deletedCount} ${type} deleted`,
        },
      }
    );

    console.log(
      `Automatic cleanup completed: ${result.deletedCount} ${type} deleted`
    );

    return {
      success: true,
      message: `Automatic cleanup completed: ${result.deletedCount} ${type} deleted`,
      deletedCount: result.deletedCount,
      cutoffDate,
      lastRun: new Date(),
    };
  } catch (error) {
    console.error(`Error during automatic ${type} cleanup:`, error);

    // Update last run with error in database
    try {
      await CleanupConfig.findOneAndUpdate(
        { type },
        {
          lastRun: new Date(),
          lastRunResult: {
            deletedCount: 0,
            success: false,
            message: `Error during automatic cleanup: ${error.message}`,
          },
        }
      );
    } catch (dbError) {
      console.error(
        `Error updating ${type} cleanup result in database:`,
        dbError
      );
    }

    return {
      success: false,
      message: `Error during automatic ${type} cleanup`,
      error: error.message,
    };
  }
};

/**
 * Start the automatic cleanup scheduler for a specific type
 */
const startCleanupScheduler = async (type) => {
  try {
    if (cleanupJobs[type]) {
      console.log(`${type} cleanup scheduler is already running`);
      return;
    }

    // Get current configuration from database
    const config = await getCleanupConfigFromDB(type);

    if (!config.enabled) {
      console.log(`${type} cleanup is disabled, not starting scheduler`);
      return;
    }

    if (!config.schedule) {
      console.log(`${type} cleanup has no schedule configured, using default`);
      config.schedule = "0 3 * * *"; // Default to daily at 3 AM
    }

    console.log(`Starting ${type} cleanup scheduler: ${config.schedule}`);

    cleanupJobs[type] = cron.schedule(
      config.schedule,
      async () => {
        console.log(`Running scheduled ${type} cleanup...`);
        const result = await performCleanup(type);
        console.log(`Scheduled ${type} cleanup result:`, result);
      },
      {
        scheduled: true,
        timezone: "UTC",
      }
    );

    console.log(`${type} cleanup scheduler started successfully`);
  } catch (error) {
    console.error(`Error starting ${type} cleanup scheduler:`, error);
    // Clean up any partial state
    if (cleanupJobs[type]) {
      cleanupJobs[type] = null;
    }
    throw error;
  }
};

/**
 * Stop the automatic cleanup scheduler for a specific type
 */
const stopCleanupScheduler = (type) => {
  if (cleanupJobs[type]) {
    cleanupJobs[type].stop();
    cleanupJobs[type] = null;
    console.log(`${type} cleanup scheduler stopped`);
  }
};

/**
 * Update cleanup configuration for a specific type
 */
const updateCleanupConfig = async (type, newConfig) => {
  try {
    // Get current configuration from database
    const currentConfig = await getCleanupConfigFromDB(type);
    const wasEnabled = currentConfig.enabled;

    // Update configuration in database
    const updatedConfig = await CleanupConfig.findOneAndUpdate(
      { type },
      {
        ...newConfig,
        type, // Ensure type is preserved
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log(`Updated ${type} cleanup config in database:`, updatedConfig);

    // Restart scheduler if configuration changed
    try {
      if (updatedConfig.enabled && !wasEnabled) {
        // Cleanup was just enabled
        console.log(`${type} cleanup was enabled, starting scheduler...`);
        await startCleanupScheduler(type);
      } else if (!updatedConfig.enabled && wasEnabled) {
        // Cleanup was just disabled
        console.log(`${type} cleanup was disabled, stopping scheduler...`);
        stopCleanupScheduler(type);
      } else if (updatedConfig.enabled && wasEnabled) {
        // Cleanup was already enabled, restart with new config
        console.log(`${type} cleanup config changed, restarting scheduler...`);
        stopCleanupScheduler(type);
        await startCleanupScheduler(type);
      } else {
        console.log(
          `${type} cleanup config updated, no scheduler changes needed`
        );
      }
    } catch (schedulerError) {
      console.error(`Error managing ${type} scheduler:`, schedulerError);
      // Don't throw here, configuration was saved successfully
      // Just log the scheduler error
    }

    return updatedConfig;
  } catch (error) {
    console.error(`Error updating ${type} cleanup configuration:`, error);
    throw error;
  }
};

/**
 * Initialize cleanup system on server start
 */
const initializeCleanup = async () => {
  console.log("Initializing system cleanup system...");

  try {
    const types = ["searchHistory"]; // Add other types here in the future

    for (const type of types) {
      // Load configuration from database
      const config = await getCleanupConfigFromDB(type);

      console.log(`Loaded ${type} cleanup configuration from database:`, {
        enabled: config.enabled,
        retentionDays: config.retentionDays,
        schedule: config.schedule,
        lastRun: config.lastRun,
      });

      // Start scheduler if cleanup is enabled
      if (config.enabled) {
        console.log(`${type} cleanup is enabled, starting scheduler...`);
        await startCleanupScheduler(type);
      } else {
        console.log(`${type} cleanup is disabled, scheduler not started`);
      }
    }

    console.log("System cleanup system initialized successfully");
  } catch (error) {
    console.error("Error initializing cleanup system:", error);
    console.log("Cleanup system will use default disabled configuration");
  }
};

module.exports = {
  performCleanup,
  startCleanupScheduler,
  stopCleanupScheduler,
  updateCleanupConfig,
  getAllCleanupConfigs,
  getCleanupConfigFromDB,
  initializeCleanup,
};
