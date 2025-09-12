import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editProperty } from "../../store/property/propertySlice";

const EditProperty = ({ setIsEdit, selectedProperty }) => {
  const dispatch = useDispatch();

  const [details, setDetails] = useState({
    status: selectedProperty?.status || "unavailable",
    message: "",
  });

  const handleDropdownChange = (e) => {
    setDetails({ ...details, status: e.target.value, message: "" });
  };

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: selectedProperty._id,
      data: details,
    };
    console.log(details);
    dispatch(editProperty(data));
    setIsEdit(false);
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Status:</label>
          <select
            name="status"
            value={details.status}
            onChange={handleDropdownChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Show Reason Input when status is unavailable */}
        {details.status === "rejected" && (
          <div className="mt-4">
            <label className="block text-sm font-medium">Message:</label>
            <textarea
              name="message"
              value={details.message}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              placeholder="Enter the message for unavailability"
              required
            ></textarea>
          </div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEdit(false)}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
