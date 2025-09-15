import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import settingService from "./settingService";
import { toast } from "react-hot-toast";

const initialState = {
  configs: {
    searchHistory: {
      type: "searchHistory",
      enabled: false,
      retentionDays: 90,
      schedule: "0 3 * * *",
      lastRun: null,
      isRunning: false,
    },
  },
  stats: {
    searchHistory: {
      count: 0,
      oldestDate: null,
      newestDate: null,
      estimatedSize: "0 MB",
    },
    total: {
      count: 0,
      estimatedSize: "0 MB",
    },
  },
  isLoading: false,
  isUpdating: false,
  isRunningCleanup: false,
  error: null,
};

export const getAllCleanupStatus = createAsyncThunk(
  "searchHistoryCleanup/getAllStatus",
  async (_, thunkAPI) => {
    try {
      return await settingService.getAllCleanupStatus();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(`Failed to load cleanup status: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCleanupStats = createAsyncThunk(
  "searchHistoryCleanup/getStats",
  async (_, thunkAPI) => {
    try {
      const response = await settingService.getStats();
      const formattedStats = settingService.formatStats(response.data);
      return { ...response, data: formattedStats };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (!error.code || error.code !== "NETWORK_ERROR") {
        toast.error(`Failed to load cleanup statistics: ${message}`);
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCleanupConfig = createAsyncThunk(
  "searchHistoryCleanup/updateConfig",
  async ({ type, config }, thunkAPI) => {
    try {
      const validation = settingService.validateConfig(config);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(", ");
        toast.error(`Invalid configuration: ${errorMessage}`);
        return thunkAPI.rejectWithValue(errorMessage);
      }

      const response = await settingService.updateConfig(type, config);
      toast.success(
        response.message || `${type} cleanup configuration updated successfully`
      );
      return { type, data: response };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(`Failed to update ${type} configuration: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const runManualCleanup = createAsyncThunk(
  "searchHistoryCleanup/runManual",
  async (type, thunkAPI) => {
    try {
      const response = await settingService.runCleanup(type);
      toast.success(
        response.message || `${type} cleanup completed successfully`
      );
      return { type, data: response };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(`Failed to run ${type} cleanup: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Other thunks can be added here if needed, like getCleanupConfig, batchUpdateConfigs, getCleanupHistory

const settingSlice = createSlice({
  name: "searchHistoryCleanup",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all cleanup status
      .addCase(getAllCleanupStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCleanupStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.configs = action.payload.data;
      })
      .addCase(getAllCleanupStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get cleanup statistics
      .addCase(getCleanupStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCleanupStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getCleanupStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cleanup configuration
      .addCase(updateCleanupConfig.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCleanupConfig.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { type, data } = action.payload;
        if (data.data.config) {
          state.configs[type] = {
            ...state.configs[type],
            ...data.data.config,
            isRunning: state.configs[type].isRunning, // Preserve running status
          };
        }
      })
      .addCase(updateCleanupConfig.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Run manual cleanup
      .addCase(runManualCleanup.pending, (state) => {
        state.isRunningCleanup = true;
        state.error = null;
      })
      .addCase(runManualCleanup.fulfilled, (state, action) => {
        state.isRunningCleanup = false;
        const { type } = action.payload;
        if (state.configs[type]) {
          state.configs[type].lastRun = new Date().toISOString();
        }
      })
      .addCase(runManualCleanup.rejected, (state, action) => {
        state.isRunningCleanup = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetState } = settingSlice.actions;
export default settingSlice.reducer;
