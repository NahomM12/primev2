import axios from "axios";
import { base_url } from "../../api/axiosConfig";

const API_URL = `${base_url}/system/search-history`;

// Helper to get auth headers
const getAuthHeaders = async () => {
  const userData = await localStorage.getItem("admin");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;
  return {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };
};

/**
 * Get all cleanup configurations and status
 * @returns {Promise<Object>} The cleanup configurations
 */
const getAllCleanupStatus = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/status`, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Get cleanup statistics for all types
 * @returns {Promise<Object>} The cleanup statistics
 */
const getStats = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/stats`, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Update cleanup configuration for a specific type
 * @param {string} type - The cleanup type (e.g., 'searchHistory')
 * @param {Object} config - The configuration object
 * @returns {Promise<Object>} The updated configuration
 */
const updateConfig = async (type, config) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${API_URL}/config/${type}`, config, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Manually trigger cleanup for a specific type
 * @param {string} type - The cleanup type (e.g., 'searchHistory')
 * @returns {Promise<Object>} The cleanup result
 */
const runCleanup = async (type) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/run/${type}`,
      {},
      { headers, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Get cleanup configuration for a specific type
 * @param {string} type - The cleanup type
 * @returns {Promise<Object>} The cleanup configuration
 */
const getConfig = async (type) => {
  try {
    const response = await getAllCleanupStatus();
    return response.data[type] || null;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Batch update multiple cleanup configurations
 * @param {Object} configs - Object with type as key and config as value
 * @returns {Promise<Object>} The updated configurations
 */
const batchUpdateConfigs = async (configs) => {
  try {
    const promises = Object.entries(configs).map(([type, config]) =>
      updateConfig(type, config)
    );

    const results = await Promise.all(promises);

    const updatedConfigs = {};
    Object.keys(configs).forEach((type, index) => {
      updatedConfigs[type] = results[index];
    });

    return updatedConfigs;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Get cleanup history/logs for a specific type
 * @param {string} type - The cleanup type
 * @param {Object} params - Query parameters (page, limit, etc.)
 * @returns {Promise<Object>} The cleanup history
 */
const getHistory = async (type, params = {}) => {
  try {
    // This would be implemented when cleanup history endpoint is available
    return {
      success: true,
      data: {
        history: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      },
    };
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * Validate cleanup configuration
 * @param {Object} config - The configuration to validate
 * @returns {Object} Validation result
 */
const validateConfig = (config) => {
  const errors = [];

  if (
    config.retentionDays !== undefined &&
    (!Number.isInteger(config.retentionDays) ||
      config.retentionDays < 1 ||
      config.retentionDays > 365)
  ) {
    errors.push("Retention days must be an integer between 1 and 365");
  }

  if (config.enabled !== undefined && typeof config.enabled !== "boolean") {
    errors.push("Enabled must be a boolean value");
  }

  if (config.schedule !== undefined) {
    const scheduleValidation = validateCronExpression(config.schedule);
    if (!scheduleValidation.isValid) {
      errors.push(`Invalid schedule: ${scheduleValidation.error}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate cron expression
 */
const validateCronExpression = (cronExpression) => {
  if (!cronExpression || typeof cronExpression !== "string") {
    return { isValid: false, error: "Cron expression must be a string" };
  }
  const parts = cronExpression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { isValid: false, error: "Cron expression must have 5 parts" };
  }

  // Basic validation for each part
  const [minute, hour, day, month, weekday] = parts;

  if (!isValidCronPart(minute, 0, 59))
    return { isValid: false, error: "Invalid minute (0-59)" };
  if (!isValidCronPart(hour, 0, 23))
    return { isValid: false, error: "Invalid hour (0-23)" };
  if (!isValidCronPart(day, 1, 31))
    return { isValid: false, error: "Invalid day (1-31)" };
  if (!isValidCronPart(month, 1, 12))
    return { isValid: false, error: "Invalid month (1-12)" };
  if (!isValidCronPart(weekday, 0, 7))
    return { isValid: false, error: "Invalid weekday (0-7)" };

  return { isValid: true };
};

/**
 * Validate individual cron part
 */
const isValidCronPart = (part, min, max) => {
  if (part === "*") return true;
  if (part.startsWith("*/")) {
    const step = parseInt(part.substring(2));
    return !isNaN(step) && step > 0 && step <= max;
  }
  if (part.includes("-")) {
    const [start, end] = part.split("-").map(Number);
    return (
      !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end
    );
  }
  if (part.includes(",")) {
    const values = part.split(",").map(Number);
    return values.every((val) => !isNaN(val) && val >= min && val <= max);
  }
  const num = parseInt(part);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Get predefined schedule options
 */
const getScheduleOptions = () => {
  return [
    {
      label: "Every hour",
      value: "0 * * * *",
      description: "Runs at the beginning of every hour",
    },
    {
      label: "Every 6 hours",
      value: "0 */6 * * *",
      description: "Runs every 6 hours (12 AM, 6 AM, 12 PM, 6 PM)",
    },
    {
      label: "Every 12 hours",
      value: "0 */12 * * *",
      description: "Runs every 12 hours (12 AM, 12 PM)",
    },
    {
      label: "Daily at 2 AM",
      value: "0 2 * * *",
      description: "Runs every day at 2:00 AM (default)",
    },
    {
      label: "Daily at 6 AM",
      value: "0 6 * * *",
      description: "Runs every day at 6:00 AM",
    },
    {
      label: "Daily at midnight",
      value: "0 0 * * *",
      description: "Runs every day at 12:00 AM",
    },
    {
      label: "Weekly (Sunday 2 AM)",
      value: "0 2 * * 0",
      description: "Runs every Sunday at 2:00 AM",
    },
    {
      label: "Weekly (Monday 2 AM)",
      value: "0 2 * * 1",
      description: "Runs every Monday at 2:00 AM",
    },
    {
      label: "Monthly (1st day 2 AM)",
      value: "0 2 1 * *",
      description: "Runs on the 1st day of every month at 2:00 AM",
    },
    {
      label: "Custom",
      value: "custom",
      description: "Enter your own cron expression",
    },
  ];
};

/**
 * Parse cron expression to human-readable format
 */
const parseCronExpression = (cronExpression) => {
  if (!cronExpression) return "Not scheduled";
  const predefined = getScheduleOptions().find(
    (opt) => opt.value === cronExpression
  );
  if (predefined) return predefined.description;

  const parts = cronExpression.split(" ");
  if (parts.length !== 5) return cronExpression;

  const [minute, hour, day, month, weekday] = parts;
  if (day === "*" && month === "*" && weekday === "*") {
    if (hour === "*") return `Every hour at minute ${minute}`;
    if (hour.startsWith("*/"))
      return `Every ${hour.substring(2)} hours at minute ${minute}`;
    return `Daily at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} UTC`;
  }
  if (day === "*" && month === "*" && weekday !== "*") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `Weekly on ${
      days[parseInt(weekday)] || `Day ${weekday}`
    } at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} UTC`;
  }
  if (month === "*" && weekday === "*" && day !== "*") {
    return `Monthly on day ${day} at ${hour.padStart(2, "0")}:${minute.padStart(
      2,
      "0"
    )} UTC`;
  }
  return `Custom: ${cronExpression}`;
};

/**
 * Format statistics for display
 */
const formatStats = (stats) => {
  if (!stats) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString();
  };

  const formatCount = (count) => {
    if (count === null || count === undefined) return "0";
    return count.toLocaleString();
  };

  return {
    ...stats,
    count: formatCount(stats.count),
    estimatedSize: stats.estimatedSize || "0 MB",
    oldestDate: formatDate(stats.oldestDate),
    newestDate: formatDate(stats.newestDate),
  };
};

const settingService = {
  getAllCleanupStatus,
  getStats,
  updateConfig,
  runCleanup,
  getConfig,
  batchUpdateConfigs,
  getHistory,
  validateConfig,
  validateCronExpression,
  getScheduleOptions,
  parseCronExpression,
  formatStats,
};

export default settingService;
