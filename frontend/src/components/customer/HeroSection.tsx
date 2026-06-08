import React from "react";
import { Row, Col, Button, Space, Typography } from "antd";
import "../../styles/HeroSection.css";

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  const buildings = [
    {
      id: 1,
      image:
        "https://cenhcm.vn/wp-content/uploads/2023/04/Vinhomes-Grand-Park.jpg",
      title: "Vinhomes Grand Park",
    },
    {
      id: 2,
      image:
        "https://phumyhunghome.vn/wp-content/uploads/2021/07/thuc-te-midtown-ve-dem-1-960x720.jpg",
      title: "Khu Đô Thị Phú Mỹ Hưng",
    },
    {
      id: 3,
      image:
        "https://smartland.vn/wp-content/uploads/2021/12/tong-quan-du-an-van-phuc-city.jpg",
      title: "Vạn Phúc City",
    },
  ];

  return (
    <section className="hero-section">
      <div className="hero-container">
        <Row gutter={[32, 32]} align="middle">
          {/* Left Column - Text Content */}
          <Col xs={24} lg={12}>
            <div className="hero-content">
              <Title level={1} className="hero-title">
                XÂY DỰNG TỔ ẤM,
                <br />
                KẾT NỐI TƯƠNG LAI
              </Title>
              <Paragraph className="hero-description">
                Nâng tầm giá trị sống qua những dự án bất động sản chiến lược.
                Chúng tôi không chỉ bán bất động sản, chúng tôi kiến tạo tương
                lai thịnh vượng cho bạn.
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" className="btn-explore">
                  Khám phá ngay
                </Button>
                <Button type="default" size="large" className="btn-contact">
                  Liên hệ
                </Button>
              </Space>
            </div>
          </Col>

          {/* Right Column - Overlapping Cards */}
          <Col xs={24} lg={12}>
            <div className="hero-cards-container">
              {buildings.map((building, index) => (
                <div
                  key={building.id}
                  className="building-card"
                  style={
                    {
                      "--card-index": index,
                    } as React.CSSProperties
                  }
                >
                  <img src={building.image} alt={building.title} />
                  <div className="card-overlay">
                    <span>{building.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Stats Section */}
        <div className="stats-section">
          {/* Title */}
          <Title level={5} className="stats-main-title">
            CÁC ĐỐI TÁC CHIẾN LƯỢC
          </Title>

          {/* Partners Grid */}
          <div className="partners-container">
            <div className="partners-grid">
              <div className="partner-logo">Vingroup</div>
              <div className="partner-logo">Capital Land</div>
              <div className="partner-logo">Tập đoàn FLC</div>
              <div className="partner-logo">Khang Điền Group</div>
              <div className="partner-logo">CTCP Regal Group</div>
            </div>
          </div>

          {/* Stats Row with Dividers */}
          <Row gutter={0} className="stats-row">
            <Col xs={24} sm={8} lg={8}>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Tòa nhà kết nối</div>
              </div>
            </Col>
            <Col xs={24} sm={8} lg={8}>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Khách hàng ưu dùng</div>
              </div>
            </Col>
            <Col xs={24} sm={8} lg={8}>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">
                  Đáp ứng nhu cầu hàng ở lần đầu tiên
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
