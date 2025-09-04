import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import managerService from "./managerService";
import toast from "react-hot-toast";

const initialState = {
  managers: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Fetch all users
export const getAllManagers = createAsyncThunk(
  "user/getAllManagers",
  async (_, thunkAPI) => {
    try {
      return await managerService.getAllManagers();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// edit a user
export const editManager = createAsyncThunk(
  "user/editManager",
  async (data, thunkAPI) => {
    try {
      return await managerService.editManager(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const addManager = createAsyncThunk(
  "user/addManager",
  async (data, thunkAPI) => {
    try {
      return await managerService.addManager(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Delete a user
export const deleteManager = createAsyncThunk(
  "user/deleteManager",
  async (id, thunkAPI) => {
    try {
      return await managerService.deleteManager(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    managerReset: (state) => {
      state.managers = [];
    },
  },
  extraReducers: (builder) => {
    builder // Handle fetching all users
      .addCase(getAllManagers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllManagers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "managers fetched successfully!";
        state.managers = action.payload;
        toast.success("managers fetched successfully!");
      })
      .addCase(getAllManagers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Handle editing a user
      .addCase(editManager.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editManager.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Users updated successfully!";
        state.users = action.payload;
        toast.success("Users updated successfully!");
      })
      .addCase(editManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(addManager.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addManager.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Users add successfully!";
        state.users = action.payload;
        toast.success("Users add successfully!");
      })
      .addCase(addManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      }) // Handle deleting a user
      .addCase(deleteManager.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "managers deleted successfully!";
        state.managers = state.managers.filter((u) => u.id !== action.payload);
        toast.success("managers deleted successfully!");
      })
      .addCase(deleteManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { messageClear, managerReset } = managerSlice.actions;

export default managerSlice.reducer;
