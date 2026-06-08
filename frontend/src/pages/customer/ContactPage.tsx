import React, { useState } from "react";
import { Layout, notification } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/customer/Header";
import ContactSection from "../../components/customer/ContactSection";

const ContactPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  // useEffect(() => {
  //   setIsLoggedIn(!!localStorage.getItem("accessToken"));
  // }, []);

  const onLogin = () => {
    navigate("/auth");
  };

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    notification.info({ message: "Đã đăng xuất tài khoản" });
  };

  return (
    <Layout>
      <AppHeader isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />
      <ContactSection />
    </Layout>
  );
};

export default ContactPage;
