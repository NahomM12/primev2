import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { useDispatch } from "react-redux";
import { changeDarkMode} from "../store/auth/authSlices"


const Navbar = () => {
  const navigate = useNavigate();
  const isDarkMode = document.body.classList.contains("dark");
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  

  const toggleDarkMode = () => {
    const managerData = JSON.parse(localStorage.getItem("manager"));
    if (managerData) {
      const newMode = managerData.preference === "dark" ? "light" : "dark";
      const data = {
        preference:newMode,
      };
      dispatch(changeDarkMode(data))
        .unwrap()
        .then(() => {
          managerData.preference = newMode;
          localStorage.setItem(
"manager", JSON.stringify(managerData));
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

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="fixed top-0 left-64 right-0 z-50 bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
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
    className="flex items-center text-gray-800 dark:text-gray-200 focus:outline-none"
  >
<MdAccountCircle className="text-3xl text-blue-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />

  </button>
  {showDropdown && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
      <ul className="py-1">
        <li
          onClick={handleProfile}
          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          View Profile
        </li>
        <li
          onClick={handleLogout}
          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
          className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          <FiLogOut className="mr-2 text-lg" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
