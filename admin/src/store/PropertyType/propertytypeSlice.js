import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyTypeService from "./propertytypeServices";

import toast from "react-hot-toast";

const initialState = {
  propertyTypes: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Fetch all property types
export const getAllPropertytypes = createAsyncThunk(
  "propertyType/getAllPropertytypes",
  async (_, thunkAPI) => {
    try {
      return await propertyTypeService.getAllPropertytypes();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete a property type
export const deletePropertytype = createAsyncThunk(
  "propertyType/deletePropertytype",
  async (id, thunkAPI) => {
    try {
      return await propertyTypeService.deletePropertytype(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Edit a property type
export const editPropertytype = createAsyncThunk(
  "propertyType/editPropertytype",
  async (updatedProperty, thunkAPI) => {
    try {
      return await propertyTypeService.editPropertytype(updatedProperty);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const addPropertytype = createAsyncThunk(
  "propertyType/addPropertytype",
  async (data, thunkAPI) => {
    try {
      return await propertyTypeService.addPropertytype(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const propertyTypeSlice = createSlice({
  name: "propertyType",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    propertyTypeReset: (state) => {
      state.propertyTypes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all propertyTypes
      .addCase(getAllPropertytypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPropertytypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Properties fetched successfully!";
        state.propertyTypes = action.payload;
      })
      .addCase(getAllPropertytypes.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Handle deleting a property
      .addCase(deletePropertytype.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePropertytype.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Property deleted successfully!";
        state.propertyTypes = state.propertyTypes.filter(
          (p) => p._id !== action.payload
        );
        toast.success("Property deleted successfully!");
      })
      .addCase(deletePropertytype.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Handle editing a property
      .addCase(editPropertytype.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editPropertytype.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Property updated successfully!";
        const index = state.propertyTypes.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.propertyTypes[index] = action.payload;
        }
        toast.success("Property updated successfully!");
      })
      .addCase(editPropertytype.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(addPropertytype.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPropertytype.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Property add successfully!";
        const index = state.propertyTypes.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.propertyTypes[index] = action.payload;
        }
        toast.success("Property add successfully!");
      })
      .addCase(addPropertytype.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { messageClear, propertyTypeReset } = propertyTypeSlice.actions;

export default propertyTypeSlice.reducer;
