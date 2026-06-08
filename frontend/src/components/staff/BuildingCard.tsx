import React from "react";
import { Card, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

interface FlexibleBuildingCard {
  id?: string | number;
  title?: string;
  buildingName?: string;
  price?: string | number;
  area?: string | number;
  bedrooms?: string;
  baths?: string;
  location?: string;
  description?: string;
  note?: string;
  image?: string;     
  imageUrl?: string;    
  address?: string;
  wardName?: string;
  provinceName?: string;
  buildingType?: string;
  structure?: string;
}

interface Props {
  building: FlexibleBuildingCard;
  variant?: "vertical" | "horizontal";
  thumbnailWidth?: number;
}

const HIGHLIGHT = "#EA0000";
const MUTED = "#8B8787";

const BuildingCard: React.FC<Props> = ({ building, variant = "vertical" }) => {
  
  // Map chuẩn chỉnh dữ liệu từ file cha truyền xuống
  const displayBuilding = {
    title: building.title || building.buildingName || "N/A",
    price: typeof building.price === "string" ? building.price : building.price ? `${new Intl.NumberFormat("vi-VN").format(Number(building.price))} VNĐ /tháng` : "Liên hệ",
    area: building.area ? (String(building.area).includes("m2") || String(building.area).includes("m²") ? building.area : `${building.area} m²`) : "N/A",
    type: building.buildingType || building.description || "Bất động sản",
    location: building.location || `${building.wardName || ""}, ${building.provinceName || ""}`.trim() || building.address || "N/A",
    // Nhận diện linh hoạt giữa thuộc tính .image (từ file cha) hoặc .imageUrl
    imageUrl: building.image || building.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop",
    note: building.note || "Chưa có thông tin mô tả chi tiết",
    structure: building.structure || "Chưa có thông tin cấu trúc",
  };

  // --- GIAO DIỆN KHUNG CARD CHUNG ---
  const renderCardContent = () => (
    <>
      <div style={{ overflow: "hidden" }}>
        <img
          src={displayBuilding.imageUrl}
          alt={displayBuilding.title}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop";
          }}
        />
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <Title level={5} style={{ margin: 0, textTransform: "uppercase", fontWeight: 700, fontSize: 15 }} ellipsis={{ rows: 1 }}>
          {displayBuilding.title}
        </Title>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <Text style={{ color: HIGHLIGHT, fontWeight: 700, flexShrink: 0 }}>
            {displayBuilding.price}
          </Text>
          <Text
            style={{
              color: "black",
              maxWidth: 150,
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={displayBuilding.location}
          >
            {displayBuilding.location}
          </Text>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Text style={{ color: HIGHLIGHT, fontWeight: 700 }}>
            {displayBuilding.area}
          </Text>
          <Text style={{ color: "black", fontSize: 12 }}>
            <strong>{displayBuilding.structure}</strong>
          </Text>
        </div>

        <Paragraph style={{ color: MUTED, margin: 0, fontSize: 13 }} ellipsis={{ rows: 2 }}>
          {displayBuilding.note}
        </Paragraph>

      </div>
    </>
  );

  // --- RENDER DỰA TRÊN VARIANT ---
  if (variant === "horizontal") {
    return (
      <Card
        hoverable
        style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #f0f0f0", width: "100%" }}
        bodyStyle={{ padding: 0, display: "flex", flexDirection: "row" }} // Nằm ngang
      >
        {renderCardContent()}
      </Card>
    );
  }

  // Luồng render mặc định dành cho "vertical" (Fix dứt điểm lỗi chết UI)
  return (
    <Card
      hoverable
      style={{
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      bodyStyle={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      {renderCardContent()}
    </Card>
  );
};

export default BuildingCard;