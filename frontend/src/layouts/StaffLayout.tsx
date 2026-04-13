import React from "react";
import { Layout, Menu, Avatar, Typography, Space } from "antd";
import {
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router-dom";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;

const StaffLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/staff/dashboard",
      icon: <HomeOutlined />,
      label: <Link to="/staff/dashboard">Dashboard</Link>,
    },
    {
      key: "/staff/buildings",
      icon: <BankOutlined />,
      label: <Link to="/staff/buildings">Buildings</Link>,
    },
    {
      key: "/staff/assignments",
      icon: <FileTextOutlined />,
      label: <Link to="/staff/assignments">Assignments</Link>,
    },
  ];

  // select menu by exact path or prefix
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
            STAFF
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
          <Avatar size={48} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 700 }}>Ant</div>
            <Text type="secondary">Staff</Text>
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
           
            <Space />
          </div>
        </Header>

        <Content style={{ background: "#f5f7fa", padding: 24 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;
