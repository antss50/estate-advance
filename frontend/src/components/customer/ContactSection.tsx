import React from "react";
import { Row, Col, Card, Form, Input, Button, Select, Typography } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  FacebookOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Footer from "./Footer";
import "../../styles/ContactSection.css";

const { Title, Paragraph } = Typography;

const ContactSection: React.FC = () => {
  const [form] = Form.useForm();

  const handleContactSubmit = (values: unknown) => {
    console.log("Contact form submitted:", values);
    form.resetFields();
  };

  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-page-heading">
            <Title level={1} className="contact-title">
              Liên hệ
            </Title>
            <Paragraph className="contact-desc">
              Đội ngũ tư vấn hoạt động 8:00 - 21:00 (Thứ 2 - Chủ nhật). Bạn có thể gọi hotline, nhắn Zalo, hoặc để lại thông tin - chúng tôi sẽ phản hồi nhanh nhất.
            </Paragraph>
          </div>

          <Row gutter={[48, 32]}>
            <Col xs={24} lg={12}>
              <div className="contact-info-list">
                <a href="tel:+84912345678" className="contact-info-card">
                  <span className="contact-info-icon">
                    <PhoneOutlined />
                  </span>
                  <span>
                    <span className="contact-info-label">HOTLINE</span>
                    <strong>+84 912 345 678</strong>
                  </span>
                </a>

                <a href="tel:+84912345678" className="contact-info-card featured">
                  <span className="contact-info-icon yellow">
                    <MessageOutlined />
                  </span>
                  <span>
                    <span className="contact-info-label">ZALO</span>
                    <strong>+84 912 345 678</strong>
                  </span>
                </a>

                <a href="https://facebook.com/estateadvance" className="contact-info-card">
                  <span className="contact-info-icon">
                    <FacebookOutlined />
                  </span>
                  <span>
                    <span className="contact-info-label">FANPAGE</span>
                    <strong>facebook.com/estateadvance</strong>
                  </span>
                </a>

                <a href="mailto:support@estateadvance.vn" className="contact-info-card">
                  <span className="contact-info-icon">
                    <MailOutlined />
                  </span>
                  <span>
                    <span className="contact-info-label">EMAIL</span>
                    <strong>support@estateadvance.vn</strong>
                  </span>
                </a>

                <div className="contact-info-card">
                  <span className="contact-info-icon">
                    <EnvironmentOutlined />
                  </span>
                  <span>
                    <span className="contact-info-label">KHU VỰC HOẠT ĐỘNG</span>
                    <strong>Trên khắp mọi miền Tổ Quốc</strong>
                  </span>
                </div>

                <div className="contact-info-card">
                  <span className="contact-info-icon">
                    <ClockCircleOutlined />
                  </span>
                  <span>
                    <span className="contact-info-label">GIỜ LÀM VIỆC</span>
                    <strong>8:00 - 21:00 (Thứ 2 - Chủ nhật)</strong>
                  </span>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <Card className="contact-form-card" variant="borderless">
                <div className="contact-form-heading">
                  <Title level={3}>Để lại thông tin</Title>
                  <Paragraph>Chúng tôi sẽ liên hệ lại trong 30 phút.</Paragraph>
                </div>

                <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
                  <Form.Item
                    label="Họ tên *"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại *"
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                  >
                    <Input placeholder="VD: 0909123456" />
                  </Form.Item>

                  <Form.Item
                    label="Nhu cầu *"
                    name="demandType"
                    rules={[{ required: true, message: "Vui lòng chọn nhu cầu" }]}
                  >
                    <Select
                      placeholder="-- Chọn --"
                      options={[
                        { value: "rent", label: "Cần thuê căn hộ" },
                        { value: "viewing", label: "Đặt lịch xem nhà" },
                        { value: "contract", label: "Tư vấn hợp đồng" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="Lời nhắn" name="message">
                    <Input.TextArea
                      rows={5}
                      placeholder="VD: Cần thuê 2PN The Origami, ngân sách 11-13tr, vào ở đầu tháng sau."
                    />
                  </Form.Item>

                  <Button type="primary" size="large" htmlType="submit" block className="btn-submit-contact">
                    Gửi thông tin
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactSection;
