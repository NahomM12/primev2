import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import schedulingService from "./schedulingService";

// Thunks for API requests
export const fetchSchedules = createAsyncThunk(
  "scheduling/fetchSchedules",
  async (_, thunkAPI) => {
    try {
      return await schedulingService.getAllSchedules();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "scheduling/createSchedule",
  async (scheduleData, thunkAPI) => {
    try {
      return await schedulingService.addSchedule(scheduleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeSchedule = createAsyncThunk(
  "scheduling/removeSchedule",
  async (id, thunkAPI) => {
    try {
      return await schedulingService.deleteSchedule(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Redux Slice
const schedulingSlice = createSlice({
  name: "scheduling",
  initialState: {
    schedules: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })
      .addCase(removeSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (schedule) => schedule.id !== action.payload.id
        );
      });
  },
});

export default schedulingSlice.reducer;
