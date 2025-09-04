import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addManager } from "../../store/manager/managerSlice";
import { getAllSubRegions } from "../../store/address/subRegion/subRegionSlice";
import { getAllRegions } from "../../store/address/region/regionSlice";

const AddManager = ({ setIsAdd }) => {
  const dispatch = useDispatch();
  const { regions } = useSelector((state) => state.regions);
  const { subRegions } = useSelector((state) => state.subregions);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    region: "",
    subregion: "",
  });

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Ensure region is stored as an integer
    }));
  };

  const filteredSubRegions = subRegions.filter(
    (subregion) => subregion?.region_id?._id == formData.region
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      region_id: formData.region,
      subregion_id: formData.subregion,
    };

    dispatch(addManager(data));
    setIsAdd(false);
  };

  return (
    <div>
      <h2>Add Manager</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
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
            {filteredSubRegions.map((subregion) => (
              <option key={subregion._id} value={subregion._id}>
                {subregion.subregion_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsAdd(false)}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddManager;
