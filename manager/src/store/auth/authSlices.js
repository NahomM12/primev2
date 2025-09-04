import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authServices";
import toast from "react-hot-toast";

const getTokenFromLocalStorage = localStorage.getItem("manager")
  ? JSON.parse(localStorage.getItem("manager"))
  : null;

const initialState = {
  user: getTokenFromLocalStorage,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Thunk for manager login
export const managerLogin = createAsyncThunk(
  "auth/manager-login",
  async (data, thunkAPI) => {
    try {
      return await authService.managerLogin(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk for updating the profile
export const updateProfile = createAsyncThunk(
  "auth/update-profile",
  async (data, thunkAPI) => {
    try {
      return await authService.updateProfile(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const changeDarkMode = createAsyncThunk(
  "auth/update",
  async (data, thunkAPI) => {
    try {
      return await authService.changeDarkMode(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    userReset: (state) => {
      state.user = null;
      localStorage.removeItem("manager");
    },
  },
  extraReducers: (builder) => {
    // manager login
    builder
      .addCase(managerLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(managerLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Login successful";
        state.user = action.payload;
      })
      .addCase(managerLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "Login failed";
      })

    // Profile update
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Profile updated successfully";
        state.user = { ...state.user, ...action.payload }; // Update user data
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "Profile update failed";
      })
      .addCase(changeDarkMode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeDarkMode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "mode changed successfully";
        if (action.payload.preference) {
          state.user.preference= action.payload.preference;
        }
      })
      .addCase(changeDarkMode.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "Profile update failed";
      });
  },
});

export const { messageClear, userReset } = authSlice.actions;

export default authSlice.reducer;
