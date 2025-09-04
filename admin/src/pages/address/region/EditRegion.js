import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateRegion } from "../../../store/address/region/regionSlice";

const EditRegion = ({ setIsEdit, selectedRegion }) => {
  const dispatch = useDispatch();
  const [regionName, setRegionName] = useState("");

  useEffect(() => {
    if (selectedRegion) {
      setRegionName(selectedRegion.name); // Pre-fill the input with the current region name
    }
  }, [selectedRegion]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (regionName.trim() === "") {
      alert("Region name cannot be empty!");
      return;
    }

    const data = {
      id: selectedRegion._id,
      data: {
        region_name: regionName,
      },
    };

    console.log(regionName);

    // Dispatch the action to update the region
    dispatch(updateRegion(data))
      .unwrap()
      .then(() => {
        alert("Region updated successfully!");
        setIsEdit(false); // Close the modal
      })
      .catch((error) => {
        console.error("Error updating region:", error);
        alert("Failed to update the region.");
      });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Edit Region
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="regionName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Region Name
          </label>
          <input
            type="text"
            id="regionName"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter region name"
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsEdit(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRegion;
