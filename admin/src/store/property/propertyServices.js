import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getAllProperties = async () => {
  const response = await axios.get(`${base_url}/property/all-properties`);
  return response.data;
};

const deleteProperty = async (id) => {
  const response = await axios.delete(
    `${base_url}/property/delete-property/${id}`
  );
  return response.data;
};

const editProperty = async (data) => {
  console.log(data);
  const response = await axios.put(
    `${base_url}/properties/${data.id}`,
    data.name
  );
  return response.data;
};

const propertyService = {
  getAllProperties,
  deleteProperty,
  editProperty,
};
export default propertyService;
