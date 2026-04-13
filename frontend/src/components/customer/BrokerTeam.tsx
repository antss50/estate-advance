import React, { useState } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../../styles/BrokerTeam.css";

interface BrokerMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  area: string;
  avatar: string;
}

const BrokerTeam: React.FC = () => {
  const brokers: BrokerMember[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      role: "Chuyên viên bất động sản",
      phone: "+84912***678",
      email: "nv.a@example.com",
      area: "Hà Nội",
      avatar: "https://i.pravatar.cc/300?img=32",
    },
    {
      id: "2",
      name: "Trần Thị B",
      role: "Chuyên viên thị trường",
      phone: "+84903***111",
      email: "tt.b@example.com",
      area: "TP. HCM",
      avatar: "https://i.pravatar.cc/300?img=12",
    },
    {
      id: "3",
      name: "TẠ NGỌC ÂN",
      role: "Chuyên viên bất động sản",
      phone: "+84905***222",
      email: "ta.ngocan@example.com",
      area: "Đà Nẵng",
      avatar: "https://i.pravatar.cc/300?img=44",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      role: "Hỗ trợ khách hàng",
      phone: "+84977***333",
      email: "pt.d@example.com",
      area: "Cần Thơ",
      avatar: "https://i.pravatar.cc/300?img=56",
    },
    {
      id: "5",
      name: "Lê Văn C",
      role: "Chuyên gia bất động sản",
      phone: "+84901***555",
      email: "lv.c@example.com",
      area: "Hải Phòng",
      avatar: "https://i.pravatar.cc/300?img=67",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(2); // Ta Ngoc An is in the middle

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? brokers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === brokers.length - 1 ? 0 : prev + 1));
  };

  const getCardPosition = (index: number) => {
    const distance = index - activeIndex;
    const adjustedDistance =
      distance > brokers.length / 2
        ? distance - brokers.length
        : distance < -brokers.length / 2
          ? distance + brokers.length
          : distance;

    if (adjustedDistance === 0) {
      return { zIndex: 30, scale: 1, opacity: 1, translateX: 0, rotateY: 0 };
    } else if (adjustedDistance === 1 || adjustedDistance === -4) {
      return {
        zIndex: 20,
        scale: 0.8,
        opacity: 0.7,
        translateX: 150,
        rotateY: -20,
      };
    } else if (adjustedDistance === -1 || adjustedDistance === 4) {
      return {
        zIndex: 20,
        scale: 0.8,
        opacity: 0.7,
        translateX: -150,
        rotateY: 20,
      };
    } else {
      return {
        zIndex: 10,
        scale: 0.6,
        opacity: 0.4,
        translateX: adjustedDistance * 80,
        rotateY: adjustedDistance * -30,
      };
    }
  };

  return (
    <section className="broker-team-section">
      <div className="broker-team-container">
        {/* Header */}
        <div className="broker-team-header">
          <h2 className="broker-team-title">
            ĐỘI NGŨ CHUYÊN VIÊN MÔI GIỚI
            <span className="title-highlight"> CHUYÊN NGHIỆP</span>
          </h2>
          <div className="title-underline"></div>
          <p className="broker-team-desc">
            Những chuyên viên giàu kinh nghiệm sẵn sàng giúp bạn tìm kiếm không
            gian lý tưởng
          </p>
        </div>

        {/* Carousel */}
        <div className="broker-carousel-wrapper">
          <div className="carousel-track">
            {brokers.map((broker, index) => {
              const position = getCardPosition(index);
              return (
                <div
                  key={broker.id}
                  className="carousel-item"
                  style={{
                    zIndex: position.zIndex,
                    transform: `scale(${position.scale}) translateX(${position.translateX}px) rotateY(${position.rotateY}deg)`,
                    opacity: position.opacity,
                  }}
                >
                  <div className="broker-card">
                    {/* Image Section */}
                    <div
                      className="card-image"
                      style={{
                        backgroundImage: `url(${broker.avatar})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    />

                    {/* Info Section with Curved Background */}
                    <div className="card-info-wrapper">
                      <div className="card-info">
                        <h3 className="broker-name">{broker.name}</h3>
                        <p className="broker-role">{broker.role}</p>
                        <p className="broker-contact">
                          <span className="contact-icon">📞</span>
                          {broker.phone}
                        </p>
                        <p className="broker-contact">
                          <span className="contact-icon">✉️</span>
                          {broker.email}
                        </p>
                        <p className="broker-contact">
                          <span className="contact-icon">📍</span>
                          {broker.area}
                        </p>

                        {/* Action Buttons */}
                        <div className="card-actions">
                          <button className="btn-contact">Liên hệ</button>
                          <button className="btn-intro">Xem giới thiệu</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows - Bottom Center */}
        <div className="carousel-navigation">
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={handlePrev}
            className="nav-arrow"
          />
          <Button
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={handleNext}
            className="nav-arrow"
          />
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {brokers.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrokerTeam;
