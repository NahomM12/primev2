import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UserManagement from "./pages/user/UserManagement";
import RentalTransactions from "./pages/transaction/RentalTransactions";
import SaleTransactions from "./pages/transaction/SaleTransactions";
import Scheduling from "./pages/transaction/Scheduling";
import Dashboard from "./pages/Dashboard";
import PropertyManagement from "./pages/property/PropertyManagement";
import ManagerLogin from "./pages/auth/ManagerLogin";
import Profile from "./pages/auth/Profile";
import ManagerLayout from "./pages/ManagerLayout";

const App = () => {
  useEffect(() => {
    const managerData = JSON.parse(localStorage.getItem("manager"));
    if (managerData && managerData.preference === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Redirect root ("/") to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Manager routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="property-management" element={<PropertyManagement />} />
          <Route path="rental-transactions" element={<RentalTransactions />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="sale-transactions" element={<SaleTransactions />} />
          <Route path="scheduling" element={<Scheduling />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Login route */}
        <Route path="/login" element={<ManagerLogin />} />
      </Routes>
    </Router>
  );
};

export default App;








// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
// import UserManagement from "./pages/user/UserManagement";
// import RentalTransactions from "./pages/transaction/RentalTransactions";
// import SaleTransactions from "./pages/transaction/SaleTransactions";
// import Scheduling from "./pages/transaction/Scheduling";
// import Dashboard from "./pages/Dashboard";
// import PropertyManagement from "./pages/property/PropertyManagement";
// import ManagerLogin from "./pages/auth/ManagerLogin";
// import { Navigate } from "react-router-dom";
// import Profile from "./pages/auth/Profile";
// import ManagerLayout from "./pages/ManagerLayout"


// const App = () => {
//   useEffect(() => {
//     const managerData = JSON.parse(localStorage.getItem("manager"));
//     if (managerData && managerData.preference === "dark") {
//       document.body.classList.add("dark");
//     }
//   }, []);
  

//   return (
//     <Router>
//       <Routes>
//       <Route path="/manager" element={<ManagerLayout />}>
//       <Route path="dashboard" element={<Dashboard />} />
//               <Route path="user-management" element={<UserManagement />} />
//               <Route path="property-management" element={<PropertyManagement />} />
//               <Route path="rental-transactions" element={<RentalTransactions />} />
//               <Route path="sale-transactions" element={< SaleTransactions />} />
//               <Route path="scheduling" element={<Scheduling />} />
//               <Route path="profile" element={<Profile />} />
//               {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
//       </Route>
             
        
//               <Route path="/login" element={<ManagerLogin />} />

      
//       </Routes>

//   </Router>
//   );
// };

// export default App;