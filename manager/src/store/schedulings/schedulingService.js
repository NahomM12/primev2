import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getAllSchedules = async () => {
  const response = await axios.get(`${base_url}/schedules`);
  return response.data;
};

const addSchedule = async (scheduleData) => {
  const response = await axios.post(`${base_url}/schedules`, scheduleData);
  return response.data;
};

const deleteSchedule = async (id) => {
  const response = await axios.delete(`${base_url}/schedules/${id}`);
  return response.data;
};

const schedulingService = {
  getAllSchedules,
  addSchedule,
  deleteSchedule,
};

export default schedulingService;
