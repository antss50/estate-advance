import React, { useEffect, useState } from "react";
import { Button, Layout, notification } from "antd";
import AppHeader from "../../components/customer/Header";
import HeroSection from "../../components/customer/HeroSection";
import FeaturesSection from "../../components/customer/FeaturesSection";
import DemandFormSection from "../../components/customer/DemandForm";
import BrokerTeam from "../../components/customer/BrokerTeam";
import FAQSection from "../../components/customer/FAQSection";
import Footer from "../../components/customer/Footer";
import "../../styles/variables.css";
import "../../styles/index.css";
import { useNavigate } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";

const UserHomepage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("accessToken");
    return !!token; // Trả về true nếu có token, ngược lại là false
  });
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi load trang
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
    }
  }, []);

  // Chuyển sang trang AuthPage khi bấm nút Đăng nhập / Đăng ký
  const onLogin = () => {
    navigate("/auth");
  };

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    notification.info({ message: "Đã đăng xuất tài khoản" });
  };

  const handleDemandSubmit = () => {
    notification.success({
      message: "Gửi nhu cầu thành công",
      description: "Chúng tôi sẽ liên hệ trong 24 giờ.",
    });
  };

  return (
    <Layout className="user-homepage-wrapper">
      <AppHeader
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <BrokerTeam />
        <div style={{ position: "relative" }}>
          <DemandFormSection
            onSubmit={handleDemandSubmit}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <FAQSection />
        <Footer />
      </main>

      <div
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined style={{ fontSize: 22 }} />}
          style={{
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(24, 144, 255, 0.4)",
          }}
          onClick={() => {
            if (!isLoggedIn) {
              notification.warning({
                message: "Yêu cầu đăng nhập",
                description:
                  "Vui lòng đăng nhập để tham gia phòng chat hỗ trợ!",
              });
              navigate("/auth");
            } else {
              navigate("/customer/chat");
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default UserHomepage;
