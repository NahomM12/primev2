import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "./notificationServices";

// Send notification
export const sendNotification = createAsyncThunk(
  "notification/send",
  async (notificationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.sendNotification(notificationData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get notifications
export const getNotifications = createAsyncThunk(
  "notification/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.getNotifications(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications.push(action.payload);
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;
