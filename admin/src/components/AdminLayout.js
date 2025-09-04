import React from "react";
import Sidebar from "../components/Sidebar"; // Sidebar component
import Header from "../components/Header"; // Header component
import { Outlet } from "react-router-dom"; // For rendering child routes

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-auto">
          <Outlet /> {/* This renders the current child route content */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
