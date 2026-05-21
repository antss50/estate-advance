import React, { useState } from "react";
import { Layout, Menu, Avatar, Button, Space, Drawer, Row, Col } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
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

  const navigationItems = [
    { key: "1", label: "Home" },
    { key: "2", label: "About" },
    { key: "3", label: "Features" },
    { key: "4", label: "Contact" },
  ];

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
          onClick={() => setMobileDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
};

export default AppHeader;
