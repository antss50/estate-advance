import React, { useState } from "react";
import { Form, Input, Button, Card, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import staffApi from "../../api/staffApi";
import "../../styles/DemandFormSection.css"; // Tận dụng style glassmorphism có sẵn của bạn

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();

  const onFinish = async (values :{ userName: string, password: string }) => {
    setLoading(true);
    try {
      const response = await staffApi.loginStaff(
        values.userName.trim(),
        values.password.trim()
      );

      // Lưu trữ thông tin đăng nhập vào LocalStorage
      localStorage.setItem("staff_token", response.token);
      localStorage.setItem("staff_info", JSON.stringify(response));
      
      message.success(`Chào mừng quay trở lại, ${response.fullName}!`);
      
      // Chuyển hướng trực tiếp vào trang chủ của Staff
      navigate("/staff/dashboard");
    } catch (error: any) {
      console.error("Login error: ", error);
      const serverMsg = error?.response?.data?.message || "Sai tài khoản hoặc mật khẩu";
      message.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          padding: "12px 12px 0 12px",
        }}
      >
        {/* Khối Tab Header tinh chỉnh giống mẫu ảnh */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            centered
            tabBarStyle={{ borderBottom: "none" }}
            items={[
              {
                key: "login",
                label: (
                  <span style={{ fontSize: "15px", fontWeight: 600, padding: "4px 8px" }}>
                    Đăng Nhập
                  </span>
                ),
              },
              {
                key: "register",
                label: (
                  <span style={{ fontSize: "15px", fontWeight: 600, padding: "4px 8px", color: "#8c8c8c" }}>
                    Đăng Ký
                  </span>
                ),
                disabled: true, // Khóa tab Đăng ký ngoài trang chủ theo phân quyền hệ thống
              },
            ]}
          />
        </div>

        {activeTab === "login" && (
          <Form layout="vertical" onFinish={onFinish} autoComplete="off">
            {/* Trường nhập User Name */}
            <Form.Item
              name="userName"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
              style={{ marginBottom: 20 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#bfbfbf", fontSize: "16px", marginRight: 4 }} />}
                placeholder="Tên đăng nhập / Email"
                style={{
                  height: 46,
                  borderRadius: 8,
                  borderColor: "#d9d9d9",
                  fontSize: "14px",
                }}
              />
            </Form.Item>

            {/* Trường nhập Mật khẩu */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              style={{ marginBottom: 28 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf", fontSize: "16px", marginRight: 4 }} />}
                placeholder="Mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined style={{ color: "#bfbfbf" }} />)}
                style={{
                  height: 46,
                  borderRadius: 8,
                  borderColor: "#d9d9d9",
                  fontSize: "14px",
                }}
              />
            </Form.Item>

            {/* Nút bấm Đăng Nhập màu xanh bo góc lớn */}
            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 46,
                  borderRadius: 24,
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "#1677ff",
                  boxShadow: "0 2px 6px rgba(22, 119, 255, 0.2)",
                  border: "none",
                }}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Login;