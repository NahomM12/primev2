import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subRegionService from "./subRegionService";
import toast from "react-hot-toast";

const initialState = {
  subRegions: [],
  totalSubRegions: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const addSubRegion = createAsyncThunk(
  "subRegion/add-subregion",
  async (data, thunkAPI) => {
    try {
      return await subRegionService.addSubRegion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllSubRegions = createAsyncThunk(
  "subRegion/all-subregions",
  async (thunkAPI) => {
    try {
      return await subRegionService.getAllSubRegions();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateSubRegion = createAsyncThunk(
  "subRegion/update-subregion",
  async (data, thunkAPI) => {
    try {
      return await subRegionService.updateSubRegion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteSubRegion = createAsyncThunk(
  "subRegion/delete-subregion",
  async (id, thunkAPI) => {
    try {
      return await subRegionService.deleteSubRegion(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAllSubRegions = createAsyncThunk(
  "subRegion/delete-subregions",
  async (thunkAPI) => {
    try {
      return await subRegionService.deleteAllSubRegions();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const subRegionSlice = createSlice({
  name: "subRegion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSubRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSubRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.createdSubRegion = action.payload;
        if (state.isSuccess === true) {
          toast.success("SubRegion Added Successfully");
        }
        state.subRegions = [...state.subRegions, action.payload];
      })
      .addCase(addSubRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(getAllSubRegions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSubRegions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.subRegions = action.payload;
      })
      .addCase(getAllSubRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(updateSubRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.subRegions = state.subRegions.map((subRegion) =>
          subRegion._id === action.payload._id ? action.payload : subRegion
        );
        if (state.isSuccess === true) {
          toast.success("SubRegion Updated Successfully");
        }
      })
      .addCase(updateSubRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(deleteSubRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.subRegions = state.subRegions.filter(
          (subRegion) => subRegion._id !== action.payload._id
        );
        if (state.isSuccess === true) {
          toast.success("SubRegion Deleted Successfully");
        }
      })
      .addCase(deleteSubRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(deleteAllSubRegions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAllSubRegions.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.subRegions = [];
        if (state.isSuccess === true) {
          toast.success("All SubRegions Deleted Successfully");
        }
      })
      .addCase(deleteAllSubRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      });
  },
});

export default subRegionSlice.reducer;