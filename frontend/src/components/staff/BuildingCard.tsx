import React from "react";
import { Card, Typography } from "antd";
import type { BuildingCard as BuildingCardType } from "../../pages/staff/mockBuildings";

const { Title, Text, Paragraph } = Typography;

interface Props {
  building: BuildingCardType;
  /**
   * 'vertical' (default) renders image on top, 'horizontal' renders thumbnail left
   */
  variant?: "vertical" | "horizontal";
  /** thumbnail width in pixels for horizontal variant (defaults to 140) */
  thumbnailWidth?: number;
}

const HIGHLIGHT = "#EA0000";
const MUTED = "#8B8787";

const BuildingCard: React.FC<Props> = ({ building, variant = "vertical" }) => {
  if (variant === "horizontal") {
    return (
      <Card
        hoverable
        style={{
          borderRadius: 8,
          overflow: "hidden",
          border: "none",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        bodyStyle={{
          padding: 12,
          display: "flex",
          gap: 12,
          alignItems: "center",
          width: "100%",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ flex: `0 0 140px` }}>
          <img
            src={building.imageUrl}
            alt={building.title}
            style={{
              width: 140,
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
              display: "block",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", flex: 1, gap: 6 }}
        >
          <Title
            level={5}
            style={{
              margin: 0,
              textTransform: "uppercase",
              fontWeight: 700,
              fontSize: 14,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {building.title}
          </Title>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: HIGHLIGHT, fontWeight: 700, fontSize: 13 }}>
              {building.price}
            </Text>
            <Text style={{ color: MUTED, fontSize: 12 }}>
              {building.location}
            </Text>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Text style={{ color: HIGHLIGHT, fontWeight: 700 }}>
              {building.area}
            </Text>
            <Text style={{ color: MUTED }}>{building.bedrooms}</Text>
            <Text style={{ color: MUTED }}>{building.baths}</Text>
          </div>

          <Paragraph style={{ color: MUTED, margin: 0 }} ellipsis={{ rows: 2 }}>
            {building.description}
          </Paragraph>
        </div>
      </Card>
    );
  }

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
        }}
      >
        <img
          src={building.imageUrl}
          alt={building.title}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            display: "block",
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
          {building.title}
        </Title>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: HIGHLIGHT, fontWeight: 700 }}>
            {building.price}
          </Text>
          <Text style={{ color: MUTED }}>{building.location}</Text>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Text style={{ color: HIGHLIGHT, fontWeight: 700 }}>
            {building.area}
          </Text>
          <Text style={{ color: MUTED }}>{building.bedrooms}</Text>
          <Text style={{ color: MUTED }}>{building.baths}</Text>
        </div>

        <Paragraph style={{ color: MUTED, margin: 0 }} ellipsis={{ rows: 3 }}>
          {building.description}
        </Paragraph>
      </div>
    </Card>
  );
};

export default BuildingCard;
