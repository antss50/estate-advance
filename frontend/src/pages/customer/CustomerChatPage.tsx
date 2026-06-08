import React, { useEffect, useMemo, useState } from "react";
import { Button, Layout, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import ChatDashboard from "../../components/chat/ChatDashboard";
import AppHeader from "../../components/customer/Header";

const { Content } = Layout;

const CustomerChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("accessToken")));

  const customer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}") as {
        id?: number;
        fullName?: string;
      };
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !customer.id) {
      notification.warning({
        message: "Yeu cau dang nhap",
        description: "Vui long dang nhap de xem phong chat ho tro.",
      });
    }
  }, [customer.id, isLoggedIn]);

  if (!isLoggedIn || !customer.id) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    notification.info({ message: "Da dang xuat tai khoan" });
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f6f8fb" }}>
      <AppHeader isLoggedIn={isLoggedIn} onLogin={() => navigate("/auth")} onLogout={handleLogout} />
      <Content style={{ padding: 24 }}>
        <div style={{ margin: "0 auto", maxWidth: 1200 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} style={{ marginBottom: 16 }}>
            Trang chủ
          </Button>
          <ChatDashboard currentUserId={Number(customer.id)} currentUserName={customer.fullName} userType="CUSTOMER" />
        </div>
      </Content>
    </Layout>
  );
};

export default CustomerChatPage;
