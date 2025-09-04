import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import React, { useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Settings from './pages/Settings';
import PropertyManagement from './pages/property/property/PropertyManagement';
import PropertyType from "./pages/property/propertytype/PropertyType";
import Region from "./pages/address/region/Region";
import SubRegion from "./pages/address/subregion/SubRegion";
import Location from "./pages/address/location/Location";
import UserManagement from './pages/user/UserManagement';
import ManagerManagement from './pages/manager/ManagerManagement';
import Navigation from './nav/Navigation';
import RentalTransactions from './pages/transaction/RentalTransactions';
import SaleTransactions from './pages/transaction/SaleTransactions';
import Profile from "./pages/auth/Profile"

const App = () => {
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData && adminData.preference === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  // Function to check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem("admin") !== null; // Adjust based on your authentication logic
  };

  return (
    <Router>
      <Routes>
        {/* Redirect "/" to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={isAuthenticated() ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="region" element={<Region />} />
          <Route path="subregion" element={<SubRegion />} />
          <Route path="location" element={<Location />} />
          <Route path="property-management" element={<PropertyManagement />} />
          <Route path="property-type" element={<PropertyType />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="rental"element={<RentalTransactions />} />
          <Route path="sale"element={<SaleTransactions />} />
          <Route path="manager-management" element={<ManagerManagement />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-All Route (Optional) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
