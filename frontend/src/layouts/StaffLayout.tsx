import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Typography, Space, Button, Result } from "antd";
import {
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  UserOutlined,
  MenuOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;

const StaffLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Trạng thái kiểm tra đăng nhập định danh của nhân viên
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [staffInfo, setStaffInfo] = useState<any>(null);

  useEffect(() => {
    // Đọc thông tin xác thực từ localStorage
    const token = localStorage.getItem("staff_token");
    const info = localStorage.getItem("staff_info");

    if (token && info) {
      setIsLoggedIn(true);
      setStaffInfo(JSON.parse(info));
    } else {
      setIsLoggedIn(false);
      setStaffInfo(null);
      
      // Nếu cố tình truy cập vào các trang con sâu (như /buildings) khi chưa đăng nhập, tự động đẩy về dashboard
      if (location.pathname !== "/staff/dashboard" && location.pathname !== "/staff/login") {
        navigate("/staff/dashboard");
      }
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_info");
    setIsLoggedIn(false);
    setStaffInfo(null);
    navigate("/staff/login");
  };

  // Định nghĩa danh mục Sidebar động phụ thuộc vào trạng thái đăng nhập
  const menuItems = [
    {
      key: "/staff/dashboard",
      icon: <HomeOutlined />,
      label: <Link to="/staff/dashboard">Dashboard</Link>,
    },
    {
      key: "/staff/buildings",
      icon: <BankOutlined />,
      label: "Buildings",
      disabled: !isLoggedIn, // Khóa tính năng click chuyển tab nếu chưa đăng nhập
    },
    {
      key: "/staff/assignments",
      icon: <FileTextOutlined />,
      label: "Assignments",
      disabled: !isLoggedIn, // Khóa tính năng click chuyển tab nếu chưa đăng nhập
    },
  ];

  const selectedKey =
    menuItems.find((m) => location.pathname.startsWith(m.key))?.key ||
    "/staff/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        style={{
          background: "#fff",
          borderRight: "1px solid rgba(0,0,0,0.04)",
          padding: 24,
        }}
        className="admin-sider"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Title level={5} style={{ margin: 0, color: "#0f172a" }}>
            STAFF PORTAL
          </Title>
          <MenuOutlined />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0 20px 0",
          }}
        >
          <Avatar 
            size={48} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: isLoggedIn ? "#1890ff" : "#bfbfbf" }}
          />
          <div>
            <div style={{ fontWeight: 700 }}>
              {isLoggedIn && staffInfo ? staffInfo.fullName : "Chưa đăng nhập"}
            </div>
            <Text type="secondary">
              {isLoggedIn && staffInfo ? `Staff | ${staffInfo.workingArea || "Toàn quốc"}` : "Giao diện hạn chế"}
            </Text>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ border: "none", fontWeight: 600 }}
          onClick={(info) => {
            navigate(info.key);
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#8c8c8c" }}>
              Hệ thống quản lý nội bộ Estate Advance
            </div>
           
            <Space>
              {isLoggedIn ? (
                <Button 
                  type="text" 
                  danger 
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  style={{ fontWeight: 500 }}
                >
                  Đăng xuất
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  icon={<LockOutlined />} 
                  onClick={() => navigate("/staff/login")}
                >
                  Đăng nhập 
                </Button>
              )}
            </Space>
          </div>
        </Header>

        <Content style={{ background: "#f5f7fa", padding: 24 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* KIỂM TRA BẢO VỆ NỘI DUNG TUYẾN ĐƯỜNG CON */}
            {isLoggedIn || location.pathname === "/staff/dashboard" ? (
              <Outlet />
            ) : (
              <Result
                status="403"
                title="Yêu cầu đăng nhập định danh"
                subTitle="Vui lòng đăng nhập tài khoản Staff để mở khóa các phân hệ quản lý Tòa nhà & phân công Khách hàng tương ứng."
                extra={
                  <Button type="primary" size="large" onClick={() => navigate("/staff/login")}>
                    Đi đến trang Đăng nhập
                  </Button>
                }
              />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;