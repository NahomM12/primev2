import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../constants/axiosConfig";
import axios from "axios";

const getNotifications = async () => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const config = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
      }`,
    },
    withCredentials: true,
  };
  const response = await axios.get(
    `${baseUrl}/notification/user-notifications`,
    config
  );
  return response.data;
};

const markNotificationAsRead = async (notificationId) => {
  const user = JSON.parse(await AsyncStorage.getItem("user"));
  const token = user?.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    `${baseUrl}/notification/read/${notificationId}`,
    {},
    config
  );
  return response.data;
};

const deleteNotification = async (notificationId) => {
  const user = JSON.parse(await AsyncStorage.getItem("user"));
  const token = user?.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(
    `${baseUrl}/notification/${notificationId}`,
    config
  );
  return response.data;
};

const notificationService = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
};

export default notificationService;
