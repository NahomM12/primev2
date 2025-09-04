import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from "./transactionService";
// Async actions
export const getAllTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await transactionService.getAllTransactions();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getTransactionsbyregion = createAsyncThunk(
  "transactions/fetchbyregion",
  async (_, thunkAPI) => {
    try {
      const response = await transactionService.getTransactionsbyregion();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    rents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(getTransactionsbyregion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionsbyregion.fulfilled, (state, action) => {
        state.loading = false;
        state.rents = action.payload;
        console.log(action.payload);
      })
      .addCase(getTransactionsbyregion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
