import axios from "axios";
import { base_url } from "../../api/axiosConfig";

const getAllTransactions = async () => {
  const response = await axios.get(`${base_url}/transaction/rent-transaction`);
  return response.data;
};

const deleteTransaction = async (id) => {
  const response = await axios.delete(`${base_url}/transactions/${id}`);
  return response.data;
};

const addTransaction = async (data) => {
  const response = await axios.post(`${base_url}/transactions`, data);
  return response.data;
};

const updateTransaction = async (data) => {
  const response = await axios.put(`${base_url}/transactions/${data.id}`, data);
  return response.data;
};

const transactionService = {
  getAllTransactions,
  deleteTransaction,
  addTransaction,
  updateTransaction,
};

export default transactionService;
