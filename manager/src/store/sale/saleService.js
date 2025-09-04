import axios from "axios";
import { base_url } from "../../api/axiosConfig";

const getAllTransactions = async () => {
  const response = await axios.get(`${base_url}/transaction/sale-transaction`);
  return response.data;
};
const getTransactionsbyregion = async () => {
  const response = await axios.get(`${base_url}/transaction/sale-transaction`);
  return response.data;
};

const transactionService = {
  getAllTransactions,
  getTransactionsbyregion,
};

export default transactionService;
