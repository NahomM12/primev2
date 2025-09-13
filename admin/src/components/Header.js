import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiKey,FiMoon, FiSun, FiSearch, FiBell } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { changeDarkMode } from "../store/auth/authSlices";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const isDarkMode = document.body.classList.contains("dark");
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    const adminData = JSON.parse(localStorage.getItem("Admin"));
    if (adminData) {
      const newMode = adminData.preference === "dark" ? "light" : "dark";
      const data = {
        preference: newMode,
      };
      dispatch(changeDarkMode(data))
        .unwrap()
        .then(() => {
          adminData.preference = newMode;
          localStorage.setItem("manager", JSON.stringify(adminData));
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
  const handleChangePassword = () => {
    navigate("change-password");
    setShowDropdown(false);
  }

  const handleProfile = () => {
    navigate("profile");
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="fixed top-0 left-64 right-0 z-50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Prime Property
        </h2>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search properties, tenants, or documents..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
          <FiBell className="text-xl" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:bg-blue-50 dark:hover:bg-gray-600"
        >
          {isDarkMode ? (
            <FiSun className="text-lg mr-2" />
          ) : (
            <FiMoon className="text-lg mr-2" />
          )}
          <span>{isDarkMode ? "Light" : "Dark"}</span>
        </button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-white dark:bg-gray-700 pl-4 pr-2 py-1.5 rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600 transition-all"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
              <MdAccountCircle className="text-xl" />
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-white">Signed in as</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">admin@primeproperty.com</p>
              </div>
              
              <button
                onClick={handleProfile}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdAccountCircle className="mr-3 text-blue-500" />
                View Profile
              </button>
              {/* 🔑 Change Password */}
    <button
      onClick={handleChangePassword}   // 👉 define this function in your component
      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors"
    >
      <FiKey className="mr-3 text-yellow-500" /> {/* you can use FiKey or any other icon */}
      Change Password
    </button>
    
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;