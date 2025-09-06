import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authServices";

const getTokenFromLocalStorage = localStorage.getItem("admin")
  ? JSON.parse(localStorage.getItem("admin"))
  : null;

const initialState = {
  user: getTokenFromLocalStorage,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ====== Async Thunks ======
export const adminLogin = createAsyncThunk(
  "auth/admin-login",
  async (data, thunkAPI) => {
    try {
      return await authService.adminLogin(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const adminRegister = createAsyncThunk(
  "auth/admin-register",
  async (data, thunkAPI) => {
    try {
      return await authService.adminRegister(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
  "auth/change-dark-mode",
  async (data, thunkAPI) => {
    try {
      return await authService.changeDarkMode(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ====== Slice ======
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    user_reset: (state) => {
      state.user = null;
      localStorage.removeItem("admin");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Register
      .addCase(adminRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminRegister.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Registration successful";
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Profile updated successfully";
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("admin", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Change Dark Mode
      .addCase(changeDarkMode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeDarkMode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Dark mode updated";
        if (action.payload.preference) {
          state.user.preference = action.payload.preference;
          localStorage.setItem("admin", JSON.stringify(state.user));
        }
      })
      .addCase(changeDarkMode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { messageClear, user_reset } = authSlice.actions;
export default authSlice.reducer;
