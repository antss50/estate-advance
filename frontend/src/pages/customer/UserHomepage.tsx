import React, { useEffect, useState } from "react";
import { Layout, notification } from "antd";
import AppHeader from "../../components/customer/Header";
import HeroSection from "../../components/customer/HeroSection";
import FeaturesSection from "../../components/customer/FeaturesSection";
import DemandFormSection from "../../components/customer/DemandForm";
import BrokerTeam from "../../components/customer/BrokerTeam";
import ContactSection from "../../components/customer/ContactSection";
import "../../styles/variables.css";
import "../../styles/index.css";
import { useNavigate } from "react-router-dom";

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

      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <BrokerTeam />
        <div style={{ position: 'relative' }}>
           <DemandFormSection onSubmit={handleDemandSubmit} isLoggedIn={isLoggedIn} />
        </div>
        <ContactSection />
      </main>
    </Layout>
  );
};

export default UserHomepage;
