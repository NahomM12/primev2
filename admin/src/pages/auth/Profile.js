import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/auth/authSlices";
import { FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState({
    personal: false,
    address: false,
  });

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "User",
    dob: user?.dob || "",
    country: user?.country || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    avatar: user?.avatar || "/default-avatar.png",
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = (section) => {
    dispatch(updateProfile(profile));
    setIsEditing({ ...isEditing, [section]: false });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-6">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold">{`${profile.firstName} ${profile.lastName}`}</h2>
          <p className="text-gray-600">{profile.role}</p>
          <p className="text-gray-500">
            {profile.city}, {profile.country}
          </p>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <button
            onClick={() =>
              setIsEditing({ ...isEditing, personal: !isEditing.personal })
            }
            className="flex items-center text-blue-600 hover:underline"
          >
            <FiEdit2 className="mr-1" /> Edit
          </button>
        </div>

        {!isEditing.personal ? (
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-medium">First Name:</span> {profile.firstName}</p>
            <p><span className="font-medium">Last Name:</span> {profile.lastName}</p>
            <p><span className="font-medium">Date of Birth:</span> {profile.dob}</p>
            <p><span className="font-medium">Email:</span> {profile.email}</p>
            <p><span className="font-medium">Phone:</span> {profile.phone}</p>
            <p><span className="font-medium">Role:</span> {profile.role}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("personal");
            }}
            className="grid grid-cols-2 gap-4"
          >
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="border p-2 rounded"
              placeholder="First Name"
            />
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="border p-2 rounded"
              placeholder="Last Name"
            />
            <input
              type="date"
              value={profile.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border p-2 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="border p-2 rounded"
              placeholder="Phone"
            />
            <button
              type="submit"
              className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </div>

      {/* Address Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Address</h3>
          <button
            onClick={() =>
              setIsEditing({ ...isEditing, address: !isEditing.address })
            }
            className="flex items-center text-blue-600 hover:underline"
          >
            <FiEdit2 className="mr-1" /> Edit
          </button>
        </div>

        {!isEditing.address ? (
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-medium">Country:</span> {profile.country}</p>
            <p><span className="font-medium">City:</span> {profile.city}</p>
            <p><span className="font-medium">Postal Code:</span> {profile.postalCode}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("address");
            }}
            className="grid grid-cols-2 gap-4"
          >
            <input
              type="text"
              value={profile.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="border p-2 rounded"
              placeholder="Country"
            />
            <input
              type="text"
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="border p-2 rounded"
              placeholder="City"
            />
            <input
              type="text"
              value={profile.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className="border p-2 rounded"
              placeholder="Postal Code"
            />
            <button
              type="submit"
              className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
