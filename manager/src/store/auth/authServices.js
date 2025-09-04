import { base_url } from "../../api/axiosConfig";
import axios from "axios";

// Function for manager login
const managerLogin = async (data) => {
  const response = await axios.post(`${base_url}/manager/login`, data);
  if (response.data) {
    localStorage.setItem("manager", JSON.stringify(response.data));
  }
  return response.data;
};

// Function for updating the profile
const updateProfile = async (data) => {
  const response = await axios.put(`${base_url}/profile/update`, data);
  return response.data;
};
const changeDarkMode = async (data) => {
  const response = await axios.put(`${base_url}/profile/darkmode`, data);
  return response.data;
};

// Consolidated authService
const authService = {
  managerLogin,
  updateProfile,
  changeDarkMode,
};

export default authService;
