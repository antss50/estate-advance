import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Layout,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "../../styles/ContactSection.css";

const { Title, Paragraph, Text } = Typography;
const { Footer } = Layout;

const ContactSection: React.FC = () => {
  const [form] = Form.useForm();

  const handleContactSubmit = (values: any) => {
    console.log("Contact form submitted:", values);
    form.resetFields();
  };

  return (
    <>
      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-bg" />

        <div className="contact-container">
          <Row gutter={[32, 32]} align="middle">
            {/* Left Column - Connect */}
            <Col xs={24} lg={12}>
              <div className="contact-left">
                <Title level={2} className="contact-title" style={{ color: "#255ecf" }}>
                  KẾT NỐI VỚI CHÚNG TÔI
                </Title>
                <Paragraph className="contact-desc">
                  Liên hệ trực tiếp với chúng tôi để được tư vấn miễn phí
                </Paragraph>

                <Space
                  size="large"
                  style={{ marginTop: 32 }}
                  direction="vertical"
                >
                  <a href="tel:+84912345678" className="contact-button phone">
                    <PhoneOutlined />
                    <span>+84 912 345 678</span>
                  </a>
                  <a
                    href="mailto:support@estateadvance.vn"
                    className="contact-button email"
                  >
                    <MailOutlined />
                    <span>support@estateadvance.vn</span>
                  </a>
                </Space>
              </div>
            </Col>

            {/* Right Column - Form */}
            <Col xs={24} lg={12}>
              <Card
                className="contact-form-card"
                title="ĐỂ LẠI THÔNG TIN LIÊN HỆ"
                bordered={false}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleContactSubmit}
                >
                  <Form.Item
                    label="Họ và Tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>

                  <Form.Item
                    label="Số Điện Thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>

                  <Form.Item
                    label="Nhu Cầu"
                    name="demand"
                    rules={[
                      { required: true, message: "Vui lòng mô tả nhu cầu" },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Mô tả nhu cầu của bạn..."
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    className="btn-submit-contact"
                  >
                    GỬI THÔNG TIN
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Footer */}
      <Footer className="app-footer">
        <div className="footer-content">
          <Row gutter={[32, 32]}>
            {/* Logo & About */}
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={5} className="footer-logo">
                  ESTATE ADVANCE
                </Title>
                <Paragraph style={{ color: "#666", fontSize: 12 }}>
                  Giải pháp toàn diện cho bất động sản thương mại
                </Paragraph>
              </div>
            </Col>

            {/* Quick Links */}
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={5}>LIÊN KẾT</Title>
                <ul className="footer-links">
                  <li>
                    <a href="#home">Trang chủ</a>
                  </li>
                  <li>
                    <a href="#about">Về chúng tôi</a>
                  </li>
                  <li>
                    <a href="#services">Dịch vụ</a>
                  </li>
                  <li>
                    <a href="#contact">Liên hệ</a>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Contact Info */}
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={5}>LIÊN HỆ</Title>
                <Paragraph style={{ fontSize: 12 }}>
                  <MailOutlined /> support@estateadvance.vn
                </Paragraph>
                <Paragraph style={{ fontSize: 12 }}>
                  <PhoneOutlined /> Hotline: 1900 1234
                </Paragraph>
                <Paragraph style={{ fontSize: 12 }}>
                  <EnvironmentOutlined /> Phường Linh Xuân, TP. HCM
                </Paragraph>
              </div>
            </Col>

            {/* Association */}
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={5}>HỘI VIÊN</Title>
                <Paragraph style={{ fontSize: 12 }}>
                  Hội môi giới BĐS TPHCM
                </Paragraph>
                <Paragraph style={{ fontSize: 12 }}>
                  Đã được xác thực & cấp chứng chỉ
                </Paragraph>
              </div>
            </Col>
          </Row>

          {/* Copyright */}
          <div className="footer-bottom">
            <hr style={{ margin: "24px 0" }} />
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={12}>
                <Text style={{ fontSize: 12, color: "#999" }}>
                  © 2026 Estate Advance. All rights reserved.
                </Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space split="|">
                  <a style={{ fontSize: 12 }}>Chính sách bảo mật</a>
                  <a style={{ fontSize: 12 }}>Điều khoản sử dụng</a>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      </Footer>
    </>
  );
};

export default ContactSection;
