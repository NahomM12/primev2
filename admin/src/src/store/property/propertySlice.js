import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "./propertyServices";
import toast from "react-hot-toast";

const initialState = {
  properties: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Fetch all properties
export const getAllProperties = createAsyncThunk(
  "property/getAllProperties",
  async (_, thunkAPI) => {
    try {
      return await propertyService.getAllProperties();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete a property
export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async (id, thunkAPI) => {
    try {
      return await propertyService.deleteProperty(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Edit a property
export const editProperty = createAsyncThunk(
  "property/editProperty",
  async (updatedProperty, thunkAPI) => {
    try {
      return await propertyService.editProperty(updatedProperty);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    propertyReset: (state) => {
      state.properties = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all properties
      .addCase(getAllProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Properties fetched successfully!";
        state.properties = action.payload.properties;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Handle deleting a property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Property deleted successfully!";
        state.properties = state.properties.filter(
          (p) => p.id !== action.payload
        );
        toast.success("Property deleted successfully!");
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Handle editing a property
      .addCase(editProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Property updated successfully!";
        const index = state.properties.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        toast.success("Property updated successfully!");
      })
      .addCase(editProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { messageClear, propertyReset } = propertySlice.actions;

export default propertySlice.reducer;
