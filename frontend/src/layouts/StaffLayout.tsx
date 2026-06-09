import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Typography, Space, Button, Result, Badge, Tooltip } from "antd";
import {
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  UserOutlined,
  MenuOutlined,
  LockOutlined,
  LogoutOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import type { LoginResponse } from "../types/user.type";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;

const StaffLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/staff/dashboard",
      icon: <HomeOutlined />,
      label: <Link to="/staff/dashboard">Thống kê</Link>,
    },
    {
      key: "/staff/buildings",
      icon: <BankOutlined />,
      label: <Link to="/staff/buildings">Quản Lý Tòa Nhà</Link>,
    },
    {
      key: "/staff/assignments",
      icon: <FileTextOutlined />,
      label: <Link to="/staff/assignments">Yêu Cầu & Phân Công</Link>,
    },
  ];

  const selectedKey =
    menuItems.find((m) => location.pathname.startsWith(m.key))?.key ||
    "/staff/dashboard";

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [staffInfo, setStaffInfo] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("staff_token");
    const info = localStorage.getItem("staff_info");

    if (token && info) {
      setIsLoggedIn(true);
      setStaffInfo(JSON.parse(info));
    } else {
      setIsLoggedIn(false);
      setStaffInfo(null);
      
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider được chuẩn hóa UI theo AdminLayout */}
      <Sider
        width={300}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#fff",
          borderRight: "1px solid rgba(0,0,0,0.04)",
          padding: 24,
        }}
        className="staff-sider"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Title level={5} style={{ margin: 0, color: "#0f172a", fontSize: 16, fontWeight: 600 }}>
            NHÂN VIÊN
          </Title>
          <MenuOutlined />
        </div>

        {/* Khối thông tin Nhân viên đồng bộ với AdminLayout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0 20px 0",
          }}
        >
          <Avatar size={48} style={{ backgroundColor: "#1890ff" }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 700 }}>
              {staffInfo ? staffInfo.fullName : "Guest Staff"}
            </div>
            <Text type="secondary">Staff | {staffInfo ? staffInfo.workingArea : "---"}</Text>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ border: "none", fontWeight: 600 }}
        />
      </Sider>

      <Layout>
        {/* Header được chuẩn hóa chiều cao, padding và đổ bóng nhẹ */}
        <Header
          style={{
            background: "#fff",
            padding: "16px 24px",
            height: "auto",
            lineHeight: "normal",
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
            <Space>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Hệ thống quản trị nội bộ
              </Text>
            </Space>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Space size={24}>
                {/* Giữ nguyên Icon Chat và các điều kiện render logic */}
                {isLoggedIn && (
                  <Tooltip title="Phòng chat hỗ trợ khách hàng">
                    <Badge count={0} size="small" offset={[2, -2]}>
                      <Button
                        type="text"
                        icon={<CommentOutlined style={{ fontSize: 20, color: "#595959" }} />}
                        onClick={() => navigate("/staff/chat")}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      />
                    </Badge>
                  </Tooltip>
                )}

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
          </div>
        </Header>

        {/* Content Area giữ nguyên logic kiểm tra phân quyền bảo vệ tuyến đường */}
        <Content style={{ background: "#f5f7fa", padding: 24 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {isLoggedIn || location.pathname === "/staff/dashboard" ? (
              <Outlet />
            ) : (
              <Result
                status="403"
                title="Yêu cầu đăng nhập định danh"
                subTitle="Vui lòng đăng nhập tài khoản Staff để mở khóa các phân hệ quản lý Tòa nhà & phân công Khách hàng tương ứng."
                extra={
                  <Button type="primary" size="large" onClick={() => navigate("/staff/login")}>
                    Đăng nhập
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