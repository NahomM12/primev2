import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editUser } from "../../store/user/userSlice";

const EditUser = ({ setIsEdit, selectedUser }) => {
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    phone: selectedUser?.phone || "",
    status: selectedUser?.status || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // const handleDropdownChange = (e) => {
  //   setUserDetails({ ...userDetails, blocked: e.target.value === "true" });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // userDetails.blocked ? "blocked" : "active";
    const data = {
      id: selectedUser._id,
      data: userDetails,
    };
    console.log(data);
    dispatch(editUser(data));
    setIsEdit(false);
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
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
            value={userDetails.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Blocked:</label>
          <select
            name="blocked"
            value={userDetails.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
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

export default EditUser;
