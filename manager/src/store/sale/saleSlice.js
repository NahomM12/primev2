import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import saleService from "./saleService";
// Async actions
export const getAllTransactions = createAsyncThunk(
  "sales/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await saleService.getAllTransactions();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getTransactionsbyregion = createAsyncThunk(
  "sales/fetchbyregion",
  async (_, thunkAPI) => {
    try {
      const response = await saleService.getTransactionsbyregion();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Slice
const saleSlice = createSlice({
  name: "sales",
  initialState: {
    sales: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all sales

      .addCase(getTransactionsbyregion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionsbyregion.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(getTransactionsbyregion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default saleSlice.reducer;
