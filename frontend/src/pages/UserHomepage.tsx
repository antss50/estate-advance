import React, { useState } from "react";
import { Layout, notification } from "antd";
import AppHeader from "../components/customer/Header";
import HeroSection from "../components/customer/HeroSection";
import FeaturesSection from "../components/customer/FeaturesSection";
import DemandFormSection from "../components/customer/DemandForm";
import BrokerTeam from "../components/customer/BrokerTeam";
import ContactSection from "../components/customer/ContactSection";
import "../styles/variables.css";
import "../styles/index.css";

const UserHomepage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLogin = () => {
    setIsLoggedIn(true);
    notification.success({ message: "Đăng nhập giả lập thành công" });
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    notification.info({ message: "Đã đăng xuất" });
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
           <DemandFormSection onSubmit={handleDemandSubmit} />
        </div>
        <ContactSection />
      </main>
    </Layout>
  );
};

export default UserHomepage;
