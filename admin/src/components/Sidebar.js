import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaHome, FaBuilding, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Sync with the current theme in localStorage
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    setIsDarkMode(currentTheme === 'dark');
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div
      className={`w-64 h-screen ${
        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-blue-700 text-white'
      }`}
    >
      <div
        className={`flex items-center justify-center h-16 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-blue-700'
        }`}
      >
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="flex flex-col p-4">
        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaHome className="mr-2" /> Dashboard
        </Link>

        {/* Property Management */}
        <Link
          to="/admin/property-management"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaBuilding className="mr-2" />
          Property Management
        </Link>

        {/* Property Type */}
        <Link
          to="/admin/property-type"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaBuilding className="mr-2" />
          Property Type
        </Link>

        {/* User Management */}
        <Link
          to="/admin/user-management"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaUser className="mr-2" />
          User Management
        </Link>

        {/* Manager Management */}
        <Link
          to="/admin/manager-management"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaUser className="mr-2" />
          Manager Management
        </Link>

        {/* Sale Transaction */}
        <Link
          to="/admin/sale"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaUser className="mr-2" />
          Sale Transaction
        </Link>

        {/* Rental Transaction */}
        <Link
          to="/admin/rental"
          className={`flex items-center p-2 mt-4 text-sm rounded ${
            isDarkMode
              ? 'hover:bg-gray-700'
              : 'hover:bg-blue-800 hover:text-gray-100'
          }`}
        >
          <FaUser className="mr-2" />
          Rental Transaction
        </Link>

        {/* Address Management Dropdown */}
        <div className="flex flex-col mt-4">
          <button
            onClick={toggleDropdown}
            className={`flex items-center justify-between p-2 text-sm rounded ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <span className="flex items-center">
              <FaUser className="mr-2" />
              Address Management
            </span>
            {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div className="mt-2 space-y-2 pl-4">
              <Link
                to="/admin/region"
                className={`flex items-center p-2 text-sm rounded ${
                  isDarkMode
                    ? 'text-gray-200 bg-gray-800 hover:bg-gray-700'
                    : 'text-blue-600 bg-gray-100 hover:bg-blue-200'
                }`}
              >
                Region
              </Link>
              <Link
                to="/admin/subregion"
                className={`flex items-center p-2 text-sm rounded ${
                  isDarkMode
                    ? 'text-gray-200 bg-gray-800 hover:bg-gray-700'
                    : 'text-blue-600 bg-gray-100 hover:bg-blue-200'
                }`}
              >
                SubRegion
              </Link>
              <Link
                to="/admin/location"
                className={`flex items-center p-2 text-sm rounded ${
                  isDarkMode
                    ? 'text-gray-200 bg-gray-800 hover:bg-gray-700'
                    : 'text-blue-600 bg-gray-100 hover:bg-blue-200'
                }`}
              >
                Location
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
