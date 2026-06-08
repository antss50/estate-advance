import React, { useState } from "react";
import { Layout, Menu, Avatar, Button, Space, Drawer, Row, Col } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Header.css";

const { Header } = Layout;

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({
  isLoggedIn,
  onLogin,
  onLogout,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { key: "/", label: "Trang Chủ" },
    { key: "/about", label: "Giới thiệu" },
    { key: "/kinh-nghiem-thue-nha", label: "Kinh Nghiệm Thuê Nhà" },
    { key: "/contact", label: "Liên hệ" },
  ];

  const selectedKeys = navigationItems.some((item) => item.key === location.pathname)
    ? [location.pathname]
    : [];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <Header className="app-header">
        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
          {/* Logo */}
          <Col xs={12} sm={8}>
            <div className="logo-container">
              <span className="logo-text">ESTATE ADVANCE</span>
            </div>
          </Col>

          {/* Desktop Navigation */}
          <Col xs={0} sm={0} md={8}>
            <Menu
              mode="horizontal"
              items={navigationItems}
              selectedKeys={selectedKeys}
              onClick={handleMenuClick}
              style={{
                border: "none",
                background: "transparent",
                width: "100%",
              }}
              className="nav-menu"
            />
          </Col>

          {/* Right Section - User Info */}
          <Col xs={12} sm={16} md={8} style={{ textAlign: "right" }}>
            {!isLoggedIn ? (
              <Space>
                <Button type="text" onClick={onLogin} className="login-btn">
                  Đăng Nhập
                </Button>
                <Button type="primary" className="signup-btn" shape="round">
                  Đăng Ký
                </Button>
              </Space>
            ) : (
              <Space>
                <span className="user-email">{localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").fullName : ""}</span>
                <Avatar src="https://i.pravatar.cc/150?img=32" />
                <Button onClick={onLogout} size="small">
                  Đăng xuất
                </Button>
              </Space>
            )}
            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerOpen(true)}
              className="mobile-menu-btn"
            />
          </Col>
        </Row>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        closeIcon={<CloseOutlined />}
      >
        <Menu
          mode="vertical"
          items={navigationItems}
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
        />
      </Drawer>
    </>
  );
};

export default AppHeader;
