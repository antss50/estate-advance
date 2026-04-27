import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import UserHomepage from "./pages/customer/UserHomepage";
import AdminLayout from "./layouts/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import BuildingManagement from "./pages/admin/BuildingManagement";
import Dashboard from "./pages/admin/Dashboard";
import StaffLayout from "./layouts/StaffLayout";
import AssignedBuilding from "./pages/staff/AssignedBuilding";
import Assignment from "./pages/staff/Assignment";
import BuildingDetail from "./pages/staff/BuildingDetail";
import CustomerDemand from "./pages/admin/CustomerDemand";
import AssignmentManagement from "./pages/admin/AssignmentManagement";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserHomepage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="buildings/:id" element={<BuildingDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customer/demands" element={<CustomerDemand />} />
            <Route path="assignments" element={<AssignmentManagement />} />
            {/* Future admin routes can be added here */}
          </Route>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="buildings" element={<AssignedBuilding />} />
            <Route path="buildings/:id" element={<BuildingDetail />} />
            <Route path="assignments" element={<Assignment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
