import React, { useState } from "react";
import { Tabs, Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import type { RegisterUserPayload } from "../../types/user.type";

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý Đăng Nhập
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // Gọi API login 
      const res = await userApi.loginUser(values.username, values.password);
      console.log("API Login Response:", res);
      if (res && res.success) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("accessToken", res.token);
      
      // 2. Lưu thông tin user thật từ API
      localStorage.setItem("user", JSON.stringify({
        id: res.id,
        username: res.username,
        fullName: res.fullName,
        email: res.email,
        phone: res.phone,
        role: "CUSTOMER" // Giữ nguyên role mặc định cho khách hàng nếu cần thiết
      }));
      
      message.success("Đăng nhập thành công!");
      navigate("/"); 
    } else {
      // Trường hợp success = false (nếu backend có trả về)
      message.error(res.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
    }
    } catch (error) {
      message.error("Tên đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Đăng Ký
  const handleRegister = async (values: RegisterUserPayload) => {
    setLoading(true);
    try {
      await userApi.registerUser(values);
      message.success("Đăng ký tài khoản thành công! Hãy đăng nhập.");
      setActiveTab("login"); // Chuyển sang tab đăng nhập
    } catch (error) {
      message.error("Đăng ký thất bại. Tài khoản hoặc email có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as any)} centered>
          
          {/* TAB ĐĂNG NHẬP */}
          <Tabs.TabPane tab="Đăng Nhập" key="login">
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập hoặc email!" }]}>
                <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập / Email" size="large" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng Nhập
              </Button>
            </Form>
          </Tabs.TabPane>

          {/* TAB ĐĂNG KÝ */}
          <Tabs.TabPane tab="Đăng Ký" key="register">
            <Form layout="vertical" onFinish={handleRegister}>
              <Form.Item name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
                <Input prefix={<IdcardOutlined />} placeholder="Họ và Tên" size="large" />
              </Form.Item>

              <Form.Item 
                name="phone" 
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải bao gồm 10 chữ số!" }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
              </Form.Item>

              <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}>
                <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
              </Form.Item>

              <Form.Item 
                name="email" 
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
              </Form.Item>

              <Form.Item 
                name="password" 
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ marginTop: 8 }}>
                Đăng Ký
              </Button>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};