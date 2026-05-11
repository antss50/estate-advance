import React from "react";
import { Card, Typography } from "antd";
import type { BuildingCard as BuildingCardType } from "../../pages/staff/mockBuildings";

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
  imageUrl?: string;
  address?: string;
  wardName?: string;
  provinceName?: string;
  buildingType?: string;
}

interface Props {
  building: BuildingCardType | FlexibleBuildingCard;
  variant?: "vertical" | "horizontal";
  thumbnailWidth?: number;
}

const HIGHLIGHT = "#EA0000";
const MUTED = "#8B8787";


// eslint-disable-next-line react-refresh/only-export-components
const BuildingCard: React.FC<Props> = ({ building, variant = "vertical" }) => {
  // Map API data to display format
  const displayBuilding = {
    title: building.title || (building as FlexibleBuildingCard).buildingName || "N/A",
    price: building.price ? `${new Intl.NumberFormat("vi-VN").format(Number(building.price))} đ/tháng` : "Liên hệ",
    area: building.area ? `${building.area} m²` : "N/A",
    bedrooms: building.bedrooms || (building as FlexibleBuildingCard).buildingType || "N/A",
    baths: building.baths || "N/A",
    location: building.location || `${(building as FlexibleBuildingCard).wardName || ""}, ${(building as FlexibleBuildingCard).provinceName || ""}`.trim() || (building as FlexibleBuildingCard).address || "N/A",
    description: building.description || (building as FlexibleBuildingCard).note || "Căn hộ chất lượng cao",
    imageUrl: building.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop",
  };
  if (variant === "horizontal") {
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
        padding: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <div
        style={{
          overflow: "hidden",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }} >
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

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Title
          level={5}
          style={{ margin: 0, textTransform: "uppercase", fontWeight: 700 }}
        >
          {displayBuilding.title}
        </Title>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={{ color: HIGHLIGHT, fontWeight: 700, flexShrink: 0 }}>
            {displayBuilding.price}
          </Text>
          <Text
            style={{
              color: MUTED,
              maxWidth: 180,
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
          <Text style={{ color: MUTED }}>{displayBuilding.bedrooms}</Text>
          <Text style={{ color: MUTED }}>{displayBuilding.baths}</Text>
        </div>

        <Paragraph style={{ color: MUTED, margin: 0 }} ellipsis={{ rows: 3 }}>
          {displayBuilding.description}
        </Paragraph>
      </div>
    </Card>
  );
}}
export default BuildingCard;
