import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { addLocation } from "../../../store/address/location/locationSlice";
import { getAllRegions } from "../../../store/address/region/regionSlice";
import { getAllSubRegions } from "../../../store/address/subRegion/subRegionSlice";

const AddLocation = ({ setIsAdd }) => {
  const dispatch = useDispatch();
  const { regions } = useSelector((state) => state.regions);
  const { subRegions } = useSelector((state) => state.subregions);

  const [formData, setFormData] = useState({
    region: "",
    subregion: "",
    location: "",
  });

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
  }, [dispatch]);

  const filteredSubRegions = subRegions?.filter(
    (subregion) => subregion.region_id?._id === formData.region
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "region" && { subregion: "" }), // Reset subregion when region changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const data = {
      region_id: formData.region,
      subregion_id: formData.subregion,
      location: formData.location,
    };
    dispatch(addLocation(data));
    setIsAdd(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">Add Location</h2>
        <button
          onClick={() => setIsAdd(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <FiX className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Region
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                     dark:focus:ring-blue-600 focus:border-transparent transition-colors"
            required
          >
            <option value="">Select a region</option>
            {regions?.map((region) => (
              <option key={region._id} value={region._id}>
                {region.region_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SubRegion
          </label>
          <select
            name="subregion"
            value={formData.subregion}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                     dark:focus:ring-blue-600 focus:border-transparent transition-colors"
            required
            disabled={!formData.region}
          >
            <option value="">Select a subregion</option>
            {filteredSubRegions?.map((subregion) => (
              <option key={subregion._id} value={subregion._id}>
                {subregion.subregion_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location Name
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                     dark:focus:ring-blue-600 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsAdd(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     focus:ring-4 focus:ring-blue-500/50 transition-colors"
          >
            Add Location
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLocation;
