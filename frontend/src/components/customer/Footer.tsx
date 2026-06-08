import React from "react";
import { Row, Col, Space } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import "../../styles/ContactSection.css";
import Paragraph from "antd/es/typography/Paragraph";

const Footer: React.FC = () => {
    return (
        <footer className="app-footer">
        <div className="footer-content">
          <Row gutter={[32, 32]}>
            {/* Logo & About */}
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={5} className="footer-logo">
                  ESTATE ADVANCE
                </Title>
                <Paragraph style={{ color: "#000000", fontSize: 12 }}>
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
                <Paragraph style={{ fontSize: 12, color: "#000000" }}>
                  © 2026 Estate Advance. All rights reserved.
                </Paragraph>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space >
                  <a style={{ fontSize: 12, color: "#000000" }}>Chính sách bảo mật</a>
                  <a style={{ fontSize: 12, color: "#000000" }}>Điều khoản sử dụng</a>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      </footer>
    )
}

export default Footer;
