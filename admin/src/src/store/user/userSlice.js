import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userServices";
import toast from "react-hot-toast";

const initialState = {
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Fetch all users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      return await userService.getAllUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, thunkAPI) => {
    try {
      return await userService.deleteUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// edit a user
export const edituser = createAsyncThunk(
  "user/edituser",
  async (data, thunkAPI) => {
    try {
      return await userService.edituser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    userReset: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Users fetched successfully!";
        state.users = action.payload;
        toast.success("Users fetched successfully!");
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Handle editing a user
      .addCase(edituser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(edituser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Users updated successfully!";
        state.users = action.payload;
        toast.success("Users updated successfully!");
      })
      .addCase(edituser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Handle deleting a user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "User deleted successfully!";
        state.users = state.users.filter((u) => u.id !== action.payload);
        toast.success("User deleted successfully!");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { messageClear, userReset } = userSlice.actions;

export default userSlice.reducer;