import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getUsersbyRegion = async () => {
  const response = await axios.get(`${base_url}/manager/all-users`);
  return response.data;
};
const deleteUser = async (id) => {
  const response = await axios.delete(`${base_url}/property-types/${id}`);
  return response.data;
};

const editUser = async (data) => {
  console.log(data);
  const response = await axios.put(
    `${base_url}/manager/edit-users/${data.id}`,
    data.data
  );
  return response.data;
};

const userService = {
  deleteUser,
  editUser,
  getUsersbyRegion,
};
export default userService;
