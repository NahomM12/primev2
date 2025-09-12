import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "./notificationService";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getNotifications = createAsyncThunk(
  "notification/get-all",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/mark-as-read",
  async (notificationId, thunkAPI) => {
    try {
      return await notificationService.markNotificationAsRead(notificationId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/delete-notification",
  async (notificationId, thunkAPI) => {
    try {
      return await notificationService.deleteNotification(notificationId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(
          (notification) => !notification.read
        ).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedNotification = action.payload;
        state.notifications = state.notifications.map((notification) =>
          notification._id === updatedNotification._id
            ? { ...notification, read: true }
            : notification
        );
        state.unreadCount = state.notifications.filter(
          (notification) => !notification.read
        ).length;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const deletedNotificationId = action.meta.arg;
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== deletedNotificationId
        );
        state.unreadCount = state.notifications.filter(
          (notification) => !notification.read
        ).length;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
