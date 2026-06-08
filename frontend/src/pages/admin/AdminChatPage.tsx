import React, { useMemo } from "react";
import { Alert } from "antd";
import ChatDashboard from "../../components/chat/ChatDashboard";


const AdminChatPage: React.FC = () => {
  const adminLikeUser = useMemo(() => {
    const admin = JSON.parse(localStorage.getItem("admin_info") || "{}");
    const staff = JSON.parse(localStorage.getItem("staff_info") || "{}");
    return admin?.id ? admin : staff;
  }, []);

  return (
    <div>
      {!adminLikeUser?.id && (
        <Alert
          showIcon
          type="warning"
          message="Chưa có thông tin tài khoản admin/staff trong localStorage"
          style={{ marginBottom: 16 }}
        />
      )}
      <ChatDashboard
        currentUserId={Number(adminLikeUser?.id ?? 0)}
        currentUserName={adminLikeUser?.fullName}
        userType="STAFF"
        viewerRole="ADMIN"
      />
    </div>
  );
};

export default AdminChatPage;
