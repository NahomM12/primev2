// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import React, { useEffect } from "react";
// import AdminLayout from "./components/AdminLayout";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import Settings from "./pages/Settings";
// import PropertyManagement from "./pages/property/property/PropertyManagement";
// import PropertyType from "./pages/property/propertytype/PropertyType";
// import Region from "./pages/address/region/Region";
// import SubRegion from "./pages/address/subregion/SubRegion";
// import Location from "./pages/address/location/Location";
// import UserManagement from "./pages/user/UserManagement";
// import ManagerManagement from "./pages/manager/ManagerManagement";
// import RentalTransactions from "./pages/transaction/RentalTransactions";
// import SaleTransactions from "./pages/transaction/SaleTransactions";
// import Profile from "./pages/auth/Profile";
// import Communications from "./pages/Communications";
// import ChangePassword from "./pages/auth/ChangePassword";
// import Notifications from "./pages/Notifications";
// // Dashboard components
// import {
//   Dashboard,
//   StatsCards,
//   RevenueChart,
//   PropertyTypesChart,
//   OccupancyRateChart,
//   RecentActivity,
// } from "./pages/Dashboard";

// const App = () => {
//   useEffect(() => {
//     const adminData = JSON.parse(localStorage.getItem("admin"));
//     if (adminData && adminData.preference === "dark") {
//       document.body.classList.add("dark");
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* Auth Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Admin Routes (no PrivateRoutes wrapper) */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="region" element={<Region />} />
//           <Route path="subregion" element={<SubRegion />} />
//           <Route path="location" element={<Location />} />
//           <Route path="property-management" element={<PropertyManagement />} />
//           <Route path="property-type" element={<PropertyType />} />
//           <Route path="rental" element={<RentalTransactions />} />
//           <Route path="sale" element={<SaleTransactions />} />
//           <Route path="user-management" element={<UserManagement />} />
//           <Route path="manager-management" element={<ManagerManagement />} />
//           <Route path="communications" element={<Communications />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="change-password" element={<ChangePassword />} />
//           <Route path="notifications" element={<Notifications />} />
//         </Route>

//         {/* Redirect "/" to dashboard */}
//         <Route path="/" element={<Navigate to="/admin/dashboard" />} />
//         <Route path="*" element={<Navigate to="/admin/dashboard" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Settings from "./pages/Settings";
import PropertyManagement from "./pages/property/property/PropertyManagement";
import PropertyType from "./pages/property/propertytype/PropertyType";
import Region from "./pages/address/region/Region";
import SubRegion from "./pages/address/subregion/SubRegion";
import Location from "./pages/address/location/Location";
import UserManagement from "./pages/user/UserManagement";
import ManagerManagement from "./pages/manager/ManagerManagement";
import RentalTransactions from "./pages/transaction/RentalTransactions";
import SaleTransactions from "./pages/transaction/SaleTransactions";
import Profile from "./pages/auth/Profile";
import Communications from "./pages/Communications";
import Notifications from "./pages/Notifications";

import ChangePassword from "./pages/auth/ChangePassword";
import {
  Dashboard,
  StatsCards,
  RevenueChart,
  PropertyTypesChart,
  OccupancyRateChart,
  RecentActivity,
} from "./pages/Dashboard";
import { PrivateRoutes } from "./Routes/PrivateRoutes";

const App = () => {
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData && adminData.preference === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes (no restriction) */}
        <Route
          path="/admin"
          element={
            <PrivateRoutes>
              <AdminLayout />
            </PrivateRoutes>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="region" element={<Region />} />
          <Route path="subregion" element={<SubRegion />} />
          <Route path="location" element={<Location />} />
          <Route path="property-management" element={<PropertyManagement />} />
          <Route path="property-type" element={<PropertyType />} />
          <Route path="rental" element={<RentalTransactions />} />
          <Route path="sale" element={<SaleTransactions />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="manager-management" element={<ManagerManagement />} />
          <Route path="communications" element={<Communications />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Redirect "/" to dashboard instead of login */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
