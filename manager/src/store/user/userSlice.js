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
export const getUsersbyRegion = createAsyncThunk(
  "user/getUsersbyRegion",
  async (_, thunkAPI) => {
    try {
      return await userService.getUsersbyRegion();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
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
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Edit a user
export const editUser = createAsyncThunk(
  "user/editUser",
  async (updatedUser, thunkAPI) => {
    try {
      return await userService.editUser(updatedUser);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
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
      .addCase(getUsersbyRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersbyRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "User fetched successfully!";
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.activeUsers = action.payload.activeUsers;
        state.blockedUsers = action.payload.blockedUsers;
      })
      .addCase(getUsersbyRegion.rejected, (state, action) => {
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
        state.users = state.users.filter((p) => p.id !== action.payload);
        toast.success("User deleted successfully!");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Handle editing a user
      .addCase(editUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "User updated successfully!";
        // console.log(action.payload);
        // const index = state.users.findIndex((p) => p._id === action.payload.id);
        // if (index !== -1) {
        //   state.users[index] = action.payload;
        // }
        toast.success("User updated successfully!");
      })
      .addCase(editUser.rejected, (state, action) => {
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
