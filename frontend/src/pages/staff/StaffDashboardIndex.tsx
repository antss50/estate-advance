import React, { useEffect, useState } from "react";
import { Typography, Card } from "antd";
// import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const StaffDashboardIndex: React.FC = () => {
  const [staffInfo, setStaffInfo] = useState<any>(null);
//   const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem("staff_info");
    if (info) {
      setStaffInfo(JSON.parse(info));
    }
  }, []);

  return (
    <div style={{ padding: "12px 0" }}>
      <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <Title level={3} style={{ margin: 0 }}>
          {staffInfo ? `Xin chào quay trở lại, ${staffInfo.fullName}!` : "Chào mừng bạn đến với Staff Portal "}
        </Title>
        <Text type="secondary" style={{ fontSize: "14px", display: "block", marginTop: "4px" }}>
          {staffInfo 
            ? `Hệ thống làm việc nội bộ của bạn tại khu vực: ${staffInfo.workingArea || "Toàn quốc"}` 
            : "Vui lòng thực hiện đăng nhập để đồng bộ dữ liệu quản trị."}
        </Text>
      </Card>
    </div>
  );
};

export default StaffDashboardIndex;