import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography, Table, Spin } from "antd";
import buildingApi from "../../api/buildingApi";
import userApi from "../../api/userApi";
import type { BuildingDTO } from "../../types/building.type";
import type { UserDTO } from "../../types/user.type";
import type { PaginatedResult } from "../../types/response.type";

const { Title } = Typography;

// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

function buildPath(values: number[], width = 500, height = 120) {
  if (!values.length) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = width / Math.max(values.length - 1, 1);
  return values
    .map(
      (value, i) =>
        `${i === 0 ? "M" : "L"} ${i * step} ${height - ((value - min) / span) * height}`,
    )
    .join(" ");
}

const STAT_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<BuildingDTO[]>([]);
  const [totalBuildings, setTotalBuildings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);

  // simple mock chart data (monthly leads / inquiries)
  const [chartData] = useState<number[]>([
    12, 18, 24, 20, 28, 30, 26, 34, 38, 45, 40, 48,
  ]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const bRes = await buildingApi.searchBuildings({ page: 1, size: 6 });
      if (bRes && bRes.data) {
        const pag = bRes.data as PaginatedResult<BuildingDTO>;
        setBuildings(pag.items || []);
        setTotalBuildings(pag.total || 0);
      }

      const uRes = await userApi.listUsers({ page: 1, size: 1 });
      if (uRes && uRes.data) {
        const pu = uRes.data as PaginatedResult<UserDTO>;
        setTotalUsers(pu.total || 0);
      }

      const sRes = await userApi.listUsers({ page: 1, size: 1, role: "STAFF" });
      if (sRes && sRes.data) {
        const ps = sRes.data as PaginatedResult<UserDTO>;
        setTotalStaff(ps.total || 0);
      }
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSummary();
  }, []);

  const columns = [
    { title: "Tên tòa nhà", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Quản lý", dataIndex: "managerName", key: "managerName" },
  ];

  const path = buildPath(chartData, 560, 140);

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 18 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Dashboard
          </Title>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={STAT_STYLE}>
              <Statistic title="Tổng tòa nhà" value={totalBuildings} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={STAT_STYLE}>
              <Statistic title="Người dùng" value={totalUsers} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={STAT_STYLE}>
              <Statistic title="Nhân viên" value={totalStaff} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={STAT_STYLE}>
              <Statistic
                title="Yêu cầu (tháng)"
                value={chartData[chartData.length - 1]}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 12 }}>
          <svg
            width="100%"
            viewBox="0 0 560 140"
            preserveAspectRatio="none"
            style={{ background: "#fff" }}
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#91d5ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${path} L 560 140 L 0 140 Z`}
              fill="url(#g1)"
              stroke="none"
            />
            <path d={path} fill="none" stroke="#1890ff" strokeWidth={2} />
          </svg>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Tòa nhà gần đây">
              <Table
                rowKey="id"
                dataSource={buildings}
                columns={columns}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Hoạt động gần đây">
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Người dùng mới: {totalUsers} đăng ký trong tháng</li>
                <li>Tòa nhà mới: {totalBuildings} tòa nhà</li>
                <li>Nhân viên: {totalStaff} đang hoạt động</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;
