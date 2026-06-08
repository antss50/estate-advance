import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getStaffs } from "../../api/staffApi";
import type { Staff } from "../../types";
import "../../styles/BrokerTeam.css";

interface BrokerMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  area: string;
  avatar: string;
  sex?: string;
}

const STAFF_AVATAR_BY_NAME: Record<string, string> = {
  // "nguyen van a": "https://example.com/male-a.jpg",
  // "tran thi b": "https://example.com/female-b.jpg",
};

const STAFF_AVATAR_BY_SEX: Record<string, string[]> = {
  MALE: [
    "https://www.khangdien.com.vn/wp-content/uploads/2026/04/mrkiet-21-420x420-1.png",
    "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-6-copy.jpg",
    "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-1-copy.jpg",
  ],
  FEMALE: [
    "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-7-copy.jpg",
    "https://www.khangdien.com.vn/wp-content/uploads/2025/06/chi-trang.jpg",
  ],
};

const normalizeText = (value?: string) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const normalizeSex = (sex?: string, fullName?: string) => {
  const normalizedSex = normalizeText(sex).toUpperCase();
  if (["MALE", "M", "NAM"].includes(normalizedSex)) return "MALE";
  if (["FEMALE", "F", "NU"].includes(normalizedSex)) return "FEMALE";

  const normalizedName = normalizeText(fullName);
  if (/\b(thi|nu)\b/.test(normalizedName)) return "FEMALE";
  if (/\b(van|huy|kiet|dung|phong|minh)\b/.test(normalizedName)) return "MALE";

  return "MALE";
};

const resolveStaffAvatar = (staff: Staff, index: number) => {
  if (staff.avatar) return staff.avatar;

  const nameKey = normalizeText(staff.fullName || staff.userName);
  const avatarByName = STAFF_AVATAR_BY_NAME[nameKey];
  if (avatarByName) return avatarByName;

  const sexKey = normalizeSex(staff.sex, staff.fullName || staff.userName);
  const avatarPool = STAFF_AVATAR_BY_SEX[sexKey] || STAFF_AVATAR_BY_SEX.MALE;
  return avatarPool[index % avatarPool.length];
};

const BrokerTeam: React.FC = () => {
  const defaultBrokers: BrokerMember[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      role: "Chuyên viên bất động sản",
      phone: "+84912***678",
      email: "nv.a@example.com",
      area: "Hà Nội",
      avatar: "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-7-copy.jpg",
    },
    {
      id: "2",
      name: "Nguyễn Thị B",
      role: "Chuyên viên thị trường",
      phone: "+84903***111",
      email: "tt.b@example.com",
      area: "TP. HCM",
      avatar: "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-7-copy.jpg",
    },
    {
      id: "3",
      name: "TẠ NGỌC ÂN",
      role: "Chuyên viên bất động sản",
      phone: "+84905***222",
      email: "ta.ngocan@example.com",
      area: "Đà Nẵng",
      avatar: "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-7-copy.jpg",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      role: "Hỗ trợ khách hàng",
      phone: "+84977***333",
      email: "pt.d@example.com",
      area: "Cần Thơ",
      avatar: "https://www.khangdien.com.vn/wp-content/uploads/2025/06/hina8041-1-7-copy.jpg",
    },
    {
      id: "5",
      name: "Lê Văn C",
      role: "Chuyên gia bất động sản",
      phone: "+84901***555",
      email: "lv.c@example.com",
      area: "Hải Phòng",
      avatar: "https://www.khangdien.com.vn/wp-content/uploads/2026/04/mrkiet-21-420x420-1.png",
    },
  ];

  const [brokers, setBrokers] = useState<BrokerMember[]>(defaultBrokers);
  const [activeIndex, setActiveIndex] = useState(2); 

  useEffect(() => {
    let mounted = true;

    const mapStaffToBroker = (staff: Staff, index: number): BrokerMember => ({
      id: String(staff.id),
      name: staff.fullName || staff.userName || `Nhân viên ${index + 1}`,
      role: staff.role === "STAFF" ? "Chuyên viên bất động sản" : staff.role || "Chuyên viên bất động sản",
      phone: staff.phone || "Đang cập nhật",
      email: staff.email || "Đang cập nhật",
      area: staff.workingArea || "Đang cập nhật",
      avatar: resolveStaffAvatar(staff, index),
      sex: normalizeSex(staff.sex, staff.fullName || staff.userName),
    });

    const loadStaffs = async () => {
      try {
        const staffs = await getStaffs();
        if (!mounted || staffs.length === 0) return;

        const mappedBrokers = staffs.map(mapStaffToBroker);
        setBrokers(mappedBrokers);
        setActiveIndex(Math.min(2, mappedBrokers.length - 1));
      } catch (error) {
        console.error("Failed to load broker team staffs:", error);
      }
    };

    loadStaffs();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePrev = () => {
    if (brokers.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? brokers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (brokers.length === 0) return;
    setActiveIndex((prev) => (prev === brokers.length - 1 ? 0 : prev + 1));
  };

  const getCardPosition = (index: number) => {
    if (brokers.length === 0) {
      return { zIndex: 0, scale: 1, opacity: 0, translateX: 0, rotateY: 0 };
    }

    const distance = index - activeIndex;
    const adjustedDistance =
      distance > brokers.length / 2
        ? distance - brokers.length
        : distance < -brokers.length / 2
          ? distance + brokers.length
          : distance;

    if (adjustedDistance === 0) {
      return { zIndex: 30, scale: 1, opacity: 1, translateX: 0, rotateY: 0 };
    } else if (adjustedDistance === 1 || adjustedDistance === -(brokers.length - 1)) {
      return {
        zIndex: 20,
        scale: 0.86,
        opacity: 0.9,
        translateX: 210,
        rotateY: -10,
      };
    } else if (adjustedDistance === -1 || adjustedDistance === brokers.length - 1) {
      return {
        zIndex: 20,
        scale: 0.86,
        opacity: 0.9,
        translateX: -210,
        rotateY: 10,
      };
    } else {
      const direction = adjustedDistance > 0 ? 1 : -1;
      return {
        zIndex: 10,
        scale: 0.72,
        opacity: 0.9,
        translateX: direction * 390,
        rotateY: direction * -8,
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
                          <span className="contact-icon">Số điện thoại: </span>
                          {broker.phone}
                        </p>
                        <p className="broker-contact">
                          <span className="contact-icon">Email: </span>
                          {broker.email}
                        </p>
                        <p className="broker-contact">
                          <span className="contact-icon">Khu vực làm việc: </span>
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
