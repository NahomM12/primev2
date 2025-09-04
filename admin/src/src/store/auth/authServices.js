import { base_url } from "../../api/axiosConfig";
import axios from "axios";

// const getTokenFromLocalStorage = localStorage.getItem("admin")
//   ? JSON.parse(localStorage.getItem("admin"))
//   : null;

const adminLogin = async (data) => {
  const response = await axios.post(`${base_url}/admin/login`, data);
  if (response.data) {
    localStorage.setItem("admin", JSON.stringify(response.data));
  }
  return response.data;
};
const updateProfile = async (data) => {
  const response = await axios.put(`${base_url}/profile/update`, data);
  return response.data;
};
const changeDarkMode = async (data) => {
  const response = await axios.put(`${base_url}/profile/darkmode`, data);
  return response.data;
};

const authService = {
  adminLogin,
  updateProfile,
  changeDarkMode,
};

export default authService;
