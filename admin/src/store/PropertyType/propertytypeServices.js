import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getAllPropertytypes = async () => {
  const response = await axios.get(`${base_url}/property-type/all-types`);
  return response.data;
};

const deletePropertytype = async (id) => {
  const response = await axios.delete(
    `${base_url}/property-type/delete-type/${id}`
  );
  return response.data;
};

const editPropertytype = async (data) => {
  const response = await axios.put(
    `${base_url}/property-type/edit-type/${data.id}`,
    data.data
  );
  return response.data;
};
const addPropertytype = async (data) => {
  const userData = await localStorage.getItem("admin");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  console.log(getTokenFromLocalStorage);

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };

  const response = await axios.post(
    `${base_url}/property-type/create-type`,
    data,
    {
      headers,
      withCredentials: true,
    }
  );
  return response.data;
};

const propertyTypeService = {
  getAllPropertytypes,
  deletePropertytype,
  editPropertytype,
  addPropertytype,
};

export default propertyTypeService;
