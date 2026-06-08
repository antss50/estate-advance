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
import { AuthPage } from "./pages/customer/AuthPage";
import Login from "./pages/staff/Login";
import StaffDashboardIndex from "./pages/staff/StaffDashboardIndex";
import { GroupChatBox } from "./components/chat/GroupChatBox";
import RentalExperiencePage from "./pages/customer/RentalExperiencePage";
import ContactPage from "./pages/customer/ContactPage";
import ChatDashboard from "./components/chat/ChatDashboard";
import CustomerChatPage from "./pages/customer/CustomerChatPage";
import AdminChatPage from "./pages/admin/AdminChatPage";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserHomepage />} />
          <Route path="/kinh-nghiem-thue-nha" element={<RentalExperiencePage />} />
          <Route path="/features" element={<Navigate to="/kinh-nghiem-thue-nha" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/buildings/:id" element={<BuildingDetail />} />
          <Route path="/customer/chat" element={<CustomerChatPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="buildings/:id" element={<BuildingDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customer/demands" element={<CustomerDemand />} />
            <Route path="assignments" element={<AssignmentManagement />} />
            <Route path="chat" element={<AdminChatPage />} />
            {/* Future admin routes can be added here */}
          </Route>
          
          <Route path="/staff/login" element={<Login />} />

          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="dashboard" element={<StaffDashboardIndex />} />
            <Route path="buildings" element={<AssignedBuilding />} />
            <Route path="buildings/:id" element={<BuildingDetail />} />
            <Route path="assignments" element={<Assignment />} />
            <Route path="chat/group" element={<GroupChatBox />} />
            <Route path="chat" element={<ChatDashboard />}/>
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
