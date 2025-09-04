import React from "react";
import Sidebar from "../components/Sidebar"; // Sidebar component
import Navbar from "../components/Navbar"; // Header component
import { Outlet } from "react-router-dom"; // For rendering child routes

const ManagerLayout = () => {
  return (
    <div className={`flex`}>  {/* Apply dark mode class here */}
        <Sidebar />
        <div className="ml-64 flex-1 bg-gray-100 dark:bg-gray-900 p-4">  {/* Dark mode for main content */}
          <Navbar/>
          <div className="p-6">
          <Outlet /> {/* This renders the current child route content */}
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
