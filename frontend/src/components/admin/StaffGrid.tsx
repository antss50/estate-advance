import React from "react";
import { Row, Col, Card, Avatar, Typography } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { Staff } from "../../types";

const { Title, Text } = Typography;

interface StaffGridProps {
  staffList: Staff[];
}

/**
 * StaffGrid: Presentational component for rendering staff cards in a responsive grid.
 * Receives `staffList` via props so data can later be fetched and passed from APIs.
 */
const StaffGrid: React.FC<StaffGridProps> = ({ staffList }) => {
  return (
    <Row gutter={[16, 16]}>
      {staffList.map((s) => (
        <Col 
        key={s.id} 
        xs={24} sm={12} md={12} lg={6}
        style={{ display: 'flex' }}>
          <Card
            hoverable
            className="premium-card"
            style={{ 
              textAlign: "center",
              flex: 1,
              display: 'flex',
              flexDirection: 'column' }}
          >
            <Avatar size={80} src={s.avatarUrl} />
            <Title
              level={5}
              style={{
                marginTop: 12,
                color: "var(--pa-dark)",
                fontWeight: 800,
              }}
            >
              {s.name}
            </Title>
            <Text style={{ color: "var(--pa-muted)" }}>{s.role}</Text>

            <div style={{ marginTop: 12, textAlign: "left" }}>
              <p>
                <PhoneOutlined />{" "}
                <Text style={{ marginLeft: 8 }}>{s.phone}</Text>
              </p>
              <p>
                <MailOutlined />{" "}
                <Text style={{ marginLeft: 8 }}>{s.email}</Text>
              </p>
              <p>
                <EnvironmentOutlined />{" "}
                <Text style={{ marginLeft: 8 }}>{s.area}</Text>
              </p>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StaffGrid;
