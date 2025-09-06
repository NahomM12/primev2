import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getAuthToken = () => {
  const adminData = localStorage.getItem("admin");
  const admin = adminData ? JSON.parse(adminData) : null;
  return admin?.token || "";
};

// Admin Register
const adminRegister = async (data) => {
  const response = await axios.post(`${base_url}/admin/register`, data);
  return response.data;
};

// Admin Login
const adminLogin = async (data) => {
  const response = await axios.post(`${base_url}/admin/login`, data);
  if (response.data) {
    localStorage.setItem("admin", JSON.stringify(response.data));
  }
  return response.data;
};

// Update Profile
const updateProfile = async (data) => {
  const token = getAuthToken();

  const response = await axios.put(`${base_url}/admin/update-profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

// Change Dark Mode Preference
const changeDarkMode = async (data) => {
  const response = await axios.put(`${base_url}/profile/darkmode`, data);
  return response.data;
};

const authService = {
  adminRegister,
  adminLogin,
  updateProfile,
  changeDarkMode,
};

export default authService;
