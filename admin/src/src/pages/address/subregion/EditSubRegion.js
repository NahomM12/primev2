import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateSubRegion } from "../../../store/address/subRegion/subRegionSlice";
import { getAllRegions } from "../../../store/address/region/regionSlice";

const EditSubRegion = ({ setIsEdit, selectedSubRegion }) => {
  const dispatch = useDispatch();
  const { regions } = useSelector((state) => state.regions);

  const [formData, setFormData] = useState({
    subregion_name: selectedSubRegion.subregion_name,
    region: selectedSubRegion.region?._id || "",
  });

  useEffect(() => {
    dispatch(getAllRegions());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateSubRegion({
        id: selectedSubRegion._id,
        data: formData,
      })
    );
    setIsEdit(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">
          Edit SubRegion
        </h2>
        <button
          onClick={() => setIsEdit(false)}
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
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 
                     dark:focus:ring-green-600 focus:border-transparent transition-colors"
            required
          >
            <option value="">Select a region</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.id}>
                {region.region_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SubRegion Name
          </label>
          <input
            type="text"
            name="subregion_name"
            value={formData.subregion_name}
            onChange={handleChange}
            placeholder="Enter subregion name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 
                     dark:focus:ring-green-600 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEdit(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     focus:ring-4 focus:ring-green-500/50 transition-colors"
          >
            Update SubRegion
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubRegion;
