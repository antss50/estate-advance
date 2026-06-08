import React from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  HomeOutlined,
  SafetyOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import "../../styles/FeaturesSection.css";

const { Title, Paragraph } = Typography;

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      id: "1",
      icon: <HomeOutlined />,
      title: "Matching Thông Minh",
      description:
        "Hệ thống phân tích nhu cầu và gợi ý những căn nhà phù hợp nhất chỉ trong vài giây.",
      colorClass: "feature-light-blue",
    },
    {
      id: "2",
      icon: <SafetyOutlined />,
      title: "An Toàn Pháp Lý",
      description:
        "100% thông tin, giá cả và pháp lý đều được xác thực rõ ràng, không phát sinh chi phí ẩn.",
      colorClass: "feature-green",
    },
    {
      id: "3",
      icon: <TeamOutlined />,
      title: "Hỗ Trợ 24/7",
      description:
        "Mỗi khách hàng sẽ được một chuyên viên tư vấn riêng hỗ trợ tận tình.",
      colorClass: "feature-white",
    },
    {
      id: "4",
      icon: <ThunderboltOutlined />,
      title: "Nhanh & Hiệu Quả",
      description:
        "Tiết kiệm 90% thời gian tìm kiếm với quy trình được tối ưu hóa.",
      colorClass: "feature-purple",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <Title level={2} className="features-title">
            <span className="features-accent">VỀ CHÚNG TÔI</span>
          </Title>
          <Paragraph style={{ fontSize: 15, color: "#555", maxWidth: 600, margin: "0 auto" }}>
            Quy trình minh bạch, các tính năng thông minh và dịch vụ tận tâm giúp bạn tìm được ngôi nhà mơ ước một cách dễ dàng và an toàn.
          </Paragraph>
        </div>

        <Row gutter={[24, 48]} className="features-grid">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={feature.id}>
              <Card
                className={`feature-card ${feature.colorClass} feature-card-${index}`}
                variant="borderless"
                hoverable
              >
                <div className="feature-icon">{feature.icon}</div>
                <Title level={5} className="feature-card-title">
                  {feature.title}
                </Title>
                <Paragraph className="feature-card-desc">
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeaturesSection;
