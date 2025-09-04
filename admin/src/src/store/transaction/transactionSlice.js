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

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, thunkAPI) => {
    try {
      await transactionService.deleteTransaction(id);
      return id; // Returning ID to remove it from the state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (data, thunkAPI) => {
    try {
      const response = await transactionService.addTransaction(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async (data, thunkAPI) => {
    try {
      const response = await transactionService.updateTransaction(data);
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
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(getAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete a transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      })

      // Add a transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })

      // Update a transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      });
  },
});

export default transactionSlice.reducer;
