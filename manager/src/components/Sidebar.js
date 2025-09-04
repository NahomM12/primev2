import React from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaHome, FaCalendarAlt, FaChartPie, FaBuilding } from "react-icons/fa";

const SidebarMenu = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-700 to-blue-900 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 text-white dark:text-gray-200 flex flex-col fixed top-0 left-0">
      {/* Sidebar Header */}
      <div className="py-6 px-6 text-3xl font-bold tracking-wider text-center">
        Prime Property
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow mt-4">
        <NavItem to="dashboard" icon={<FaChartPie />} label="Dashboard" />
        <NavItem to="user-management" icon={<FaUser />} label="User Management" />
        <NavItem to="property-management" icon={<FaHome />} label="Property Management" />
        <NavItem to="rental-transactions" icon={<FaBuilding />} label="Rental Transactions" />
        <NavItem to="sale-transactions" icon={<FaBuilding />} label="Sale Transactions" />
        <NavItem to="scheduling" icon={<FaCalendarAlt />} label="Scheduling" />
      </nav>

      {/* Footer */}
      <footer className="py-4 px-6 text-sm text-gray-300 text-center border-t border-blue-800 dark:border-gray-600">
        Prime Property 
         {/* {new Date().getFullYear()} */}
      </footer>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-6 py-3 my-1 transition-all rounded-lg 
      ${isActive ? "bg-blue-900 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700 dark:hover:text-white"}`}
  >
    <span className="text-xl mr-4">{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default SidebarMenu;
