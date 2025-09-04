import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { changeDarkMode} from "../store/auth/authSlices";
import { useDispatch } from "react-redux";


const Navbar = () => {
  const navigate = useNavigate();
  const isDarkMode = document.body.classList.contains("dark");
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);


  const toggleDarkMode = () => {
    const adminData = JSON.parse(localStorage.getItem("Admin"));
    if (adminData) {
      const newMode = adminData.preference === "dark" ? "light" : "dark";
      const data = {
        preference:newMode,
      };
      dispatch(changeDarkMode(data))
        .unwrap()
        .then(() => {
          adminData.preference = newMode;
          localStorage.setItem(
"manager", JSON.stringify(adminData));
          document.body.classList.toggle("dark", newMode === "dark");
        })
        .catch((error) => {
          console.error("Failed to update dark mode:", error);
        });
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  // Navigate to profile page
  const handleProfile = () => {
    navigate("profile");
  };

  
  return (
    <div className="fixed top-0 left-64 right-0 z-50 bg-white dark:bg-gray-600 dark:bg-white shadow-md p-4 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-gray-400">
          Prime Property
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {isDarkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>


        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-blue-900 dark:text-orange-400 focus:outline-none"
          >
            <MdAccountCircle className="text-3xl hover:text-orange-500 dark:hover:text-orange-300" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-blue-800 rounded-md shadow-lg">
              <ul className="py-1">
                <li
                  onClick={handleProfile}
                  className="block px-4 py-2 text-blue-900 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-blue-700 cursor-pointer"
                >
                  View Profile
                </li>
                <li
                  onClick={handleLogout}
                  className="block px-4 py-2 text-blue-900 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-blue-700 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-orange-600 rounded-md shadow hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <FiLogOut className="mr-2 text-lg" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
