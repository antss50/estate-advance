import React from "react";
import { Layout, Menu, Avatar, Typography, Space } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router-dom";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <HomeOutlined />,
      label: <Link to="/admin/dashboard">Thống Kê</Link>,
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Quản Lý Người Dùng</Link>,
    },
    {
      key: "/admin/buildings",
      icon: <BankOutlined />,
      label: <Link to="/admin/buildings">Quản Lý Tòa Nhà</Link>,
    },
    {
      key: "/admin/assignments",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/assignments">Quản Lý Phân Công</Link>,
    },
    {
      key: "/admin/customer/demands",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/customer/demands">Nhu Cầu Khách Hàng</Link>,
    },
    {
      key: "/admin/chat",
      icon: <MessageOutlined />,
      label: <Link to="/admin/chat">Chat</Link>,
    }
  ];

  // select menu by exact path or prefix
  const selectedKey =
    menuItems.find((m) => location.pathname.startsWith(m.key))?.key ||
    "/admin/dashboard";

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
            QUẢN TRỊ VIÊN
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
            <Text type="secondary">Administrator</Text>
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
            
            <Space>{/* right-side header actions can go here */}</Space>
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

export default AdminLayout;
