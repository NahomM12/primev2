import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/auth/authSlices";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProfile = { ...profile };
    if (!updatedProfile.password) {
      delete updatedProfile.password;
    }
    dispatch(updateProfile(updatedProfile));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={profile.password}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter your password (optional)"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
