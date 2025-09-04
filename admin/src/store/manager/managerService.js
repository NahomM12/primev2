import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getAllManagers = async () => {
  const response = await axios.get(`${base_url}/admin/all-managers`);
  return response.data;
};

const deleteManager = async (id) => {
  const response = await axios.delete(`${base_url}/admin/delete-manager/${id}`);
  return response.data;
};

const editManager = async (data) => {
  console.log(data);
  const response = await axios.put(
    `${base_url}/managers/${data.id}`,
    data.data
  );
  return response.data;
};
const addManager = async (data) => {
  console.log(data);
  const response = await axios.post(`${base_url}/admin/add-manager`, data);
  return response.data;
};
const managerService = {
  getAllManagers,
  deleteManager,
  editManager,
  addManager,
};
export default managerService;
