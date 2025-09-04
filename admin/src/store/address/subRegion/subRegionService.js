import { base_url, config } from "../../../api/axiosConfig";
import axios from "axios";

const addSubRegion = async (data) => {
  const response = await axios.post(
    `${base_url}/subregion/add-subregion`,
    data
  );
  return response.data;
};

const getAllSubRegions = async () => {
  const response = await axios.get(`${base_url}/subregion/all-subregions`);
  return response.data;
};

const updateSubRegion = async (data) => {
  const response = await axios.put(
    `${base_url}/subregion/edit-subregion/${data.id}`,
    data.data
  );
  return response.data;
};

const deleteSubRegion = async (id) => {
  const response = await axios.delete(`${base_url}/subregion/delete/${id}`);
  return response.data;
};

const deleteAllSubRegions = async () => {
  const response = await axios.delete(`${base_url}/region/delete-all`);
  return response.data;
};

const subRegionService = {
  addSubRegion,
  getAllSubRegions,
  updateSubRegion,
  deleteSubRegion,
  deleteAllSubRegions,
};

export default subRegionService;
