import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Typography,
  message,
} from "antd";
import {
  DollarOutlined,
  FileDoneOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import administrativeApi from "../../api/administrativeApi";
import type { StaffStatisticsResponse } from "../../types";

const { Text, Title } = Typography;

type ChartTab = "revenue" | "deals";

interface RevenueChartPoint {
  day: number;
  revenue: number;
}

interface StaffInfo {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  workingArea?: string;
}

const STAT_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
};

const PROFILE_CARD_STYLE: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eef1f4",
  borderRadius: 12,
  boxShadow: "0 10px 28px rgba(31, 45, 61, 0.08)",
};

const CHART_SECTION_STYLE: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eef1f4",
  borderRadius: 12,
  boxShadow: "0 10px 28px rgba(31, 45, 61, 0.08)",
  padding: 20,
};

const CHART_TAB_BUTTON_STYLE: React.CSSProperties = {
  background: "transparent",
  border: 0,
  borderBottom: "3px solid transparent",
  color: "#9aa4af",
  cursor: "pointer",
  font: "inherit",
  fontSize: 14,
  padding: "0 0 8px",
};

const ACTIVE_CHART_TAB_BUTTON_STYLE: React.CSSProperties = {
  ...CHART_TAB_BUTTON_STYLE,
  borderBottomColor: "#1677ff",
  color: "#1677ff",
  fontWeight: 600,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const formatMillion = (value: number) => `${Math.round(value / 1_000_000)} M`;

const MONTH_OPTIONS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const MOCK_REVENUE_CHART_DATA: RevenueChartPoint[] = [
  { day: 1, revenue: 18_000_000 },
  { day: 3, revenue: 24_000_000 },
  { day: 6, revenue: 12_000_000 },
  { day: 9, revenue: 32_000_000 },
  { day: 12, revenue: 28_000_000 },
  { day: 15, revenue: 36_000_000 },
  { day: 18, revenue: 31_000_000 },
  { day: 21, revenue: 44_000_000 },
  { day: 24, revenue: 39_000_000 },
  { day: 27, revenue: 52_000_000 },
  { day: 30, revenue: 34_000_000 },
];

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const readStaffInfo = (): StaffInfo | null => {
  const rawInfo = localStorage.getItem("staff_info");
  if (!rawInfo) return null;

  const parsed = JSON.parse(rawInfo) as Partial<StaffInfo>;
  const id = Number(parsed.id);

  return id ? { ...parsed, id } : null;
};

const toRevenuePath = (
  data: RevenueChartPoint[],
  width: number,
  height: number,
  maxRevenue: number,
) =>
  data
    .map((point, index) => {
      const x = ((point.day - 1) / 29) * width;
      const y = height - (point.revenue / maxRevenue) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

const RevenueChart: React.FC<{ data: RevenueChartPoint[] }> = ({ data }) => {
  const width = 960;
  const height = 320;
  const maxRevenue = 60_000_000;
  const path = toRevenuePath(data, width, height, maxRevenue);
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;
  const yAxisValues = [50_000_000, 40_000_000, 30_000_000, 20_000_000, 10_000_000];
  const xAxisValues = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        width="100%"
        viewBox="0 0 1060 420"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        style={{ minWidth: 760 }}
      >
        <defs>
          <linearGradient id="staffRevenueArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1499f3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1499f3" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <g transform="translate(62 24)">
          <line x1={0} x2={0} y1={0} y2={height} stroke="#aab2ba" />
          <line x1={0} x2={width} y1={height} y2={height} stroke="#aab2ba" />

          {yAxisValues.map((value) => {
            const y = height - (value / maxRevenue) * height;
            return (
              <text
                fill="#18212f"
                fontSize={12}
                key={value}
                textAnchor="end"
                x={-18}
                y={y + 4}
              >
                {formatMillion(value)}
              </text>
            );
          })}

          {xAxisValues.map((day) => {
            const x = ((day - 1) / 29) * width;
            return (
              <g key={day}>
                <line x1={x} x2={x} y1={height} y2={height + 8} stroke="#aab2ba" />
                <text fill="#18212f" fontSize={12} textAnchor="middle" x={x} y={height + 34}>
                  {day}th
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#staffRevenueArea)" />
          <path d={path} fill="none" stroke="#1499f3" strokeLinecap="round" strokeWidth={5} />

          {data.slice(1, -1).map((point) => {
            const x = ((point.day - 1) / 29) * width;
            const y = height - (point.revenue / maxRevenue) * height;
            return (
              <g key={point.day}>
                <line stroke="#aeb8c2" strokeDasharray="4 4" x1={x} x2={x} y1={y} y2={height} />
                <circle cx={x} cy={y} fill="#fff" r={5} stroke="#095cff" strokeWidth={2} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const DealPerformanceChart: React.FC<{ stats: StaffStatisticsResponse }> = ({
  stats,
}) => {
  const data = [
    {
      label: "Sale Deals",
      value: stats.totalSaleDeals || 0,
      revenue: stats.revenueSale || 0,
      color: "#1677ff",
    },
    {
      label: "Rent Deals",
      value: stats.totalRentDeals || 0,
      revenue: stats.revenueRent || 0,
      color: "#52c41a",
    },
  ];
  const maxDeal = Math.max(...data.map((item) => item.value), 1);

  return (
    <Space direction="vertical" size={18} style={{ width: "100%", padding: "24px 0" }}>
      {data.map((item) => (
        <Row align="middle" gutter={16} key={item.label}>
          <Col xs={24} md={4}>
            <Text strong>{item.label}</Text>
          </Col>
          <Col xs={24} md={16}>
            <div
              style={{
                background: "#edf0f3",
                borderRadius: 999,
                height: 34,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: item.color,
                  borderRadius: 999,
                  height: "100%",
                  width: `${Math.max((item.value / maxDeal) * 100, item.value ? 8 : 0)}%`,
                }}
              />
            </div>
          </Col>
          <Col xs={24} md={4}>
            <Text strong>{item.value}</Text>
            <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
              {formatCurrency(item.revenue)}
            </Text>
          </Col>
        </Row>
      ))}
    </Space>
  );
};

const StaffChartSection: React.FC<{
  activeTab: ChartTab;
  month: number;
  revenueData: RevenueChartPoint[];
  stats: StaffStatisticsResponse;
  onMonthChange: (month: number) => void;
  onTabChange: (tab: ChartTab) => void;
}> = ({ activeTab, month, revenueData, stats, onMonthChange, onTabChange }) => (
  <section style={CHART_SECTION_STYLE}>
    <Space direction="vertical" size={18} style={{ width: "100%" }}>
      <Space size={64}>
        <button
          onClick={() => onTabChange("revenue")}
          style={
            activeTab === "revenue"
              ? ACTIVE_CHART_TAB_BUTTON_STYLE
              : CHART_TAB_BUTTON_STYLE
          }
          type="button"
        >
          Revenue
        </button>
        <button
          onClick={() => onTabChange("deals")}
          style={
            activeTab === "deals"
              ? ACTIVE_CHART_TAB_BUTTON_STYLE
              : CHART_TAB_BUTTON_STYLE
          }
          type="button"
        >
          Deal Performance
        </button>
      </Space>

      <Select
        options={MONTH_OPTIONS}
        onChange={onMonthChange}
        size="small"
        style={{ width: 124 }}
        value={month}
      />

      {activeTab === "revenue" ? (
        <RevenueChart data={revenueData} />
      ) : (
        <DealPerformanceChart stats={stats} />
      )}
    </Space>
  </section>
);

const StaffDashboardIndex: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
  const [stats, setStats] = useState<StaffStatisticsResponse | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("revenue");
  const [selectedChartMonth, setSelectedChartMonth] = useState(1);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartPoint[]>(
    MOCK_REVENUE_CHART_DATA,
  );

  useEffect(() => {
    const currentStaff = readStaffInfo();
    setStaffInfo(currentStaff);

    if (!currentStaff) {
      message.error(
        "Kh\u00f4ng t\u00ecm th\u1ea5y th\u00f4ng tin nh\u00e2n vi\u00ean. Vui l\u00f2ng \u0111\u0103ng nh\u1eadp l\u1ea1i.",
      );
      return;
    }

    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await administrativeApi.getStaffStatistics(
          currentStaff.id,
        );
        setStats(response);
      } catch (error) {
        console.error("Error fetching staff statistics:", error);
        message.error("Kh\u00f4ng th\u1ec3 t\u1ea3i th\u1ed1ng k\u00ea nh\u00e2n vi\u00ean");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const displayName =
    stats?.staffName || staffInfo?.fullName || "Nh\u00e2n vi\u00ean";
  const displayEmail = stats?.email || staffInfo?.email || "-";
  const displayPhone = stats?.phone || staffInfo?.phone || "-";
  const performance = clampPercent(stats?.performance || 0);

  const handleChartMonthChange = (month: number) => {
    setSelectedChartMonth(month);
    setRevenueChartData(MOCK_REVENUE_CHART_DATA);
  };

  return (
    <div style={{ padding: "12px 0" }}>
      <Spin spinning={loading}>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Card style={PROFILE_CARD_STYLE} bodyStyle={{ padding: 20 }}>
            <Row align="middle" gutter={[16, 16]} justify="space-between">
              <Col>
                <Space align="center" size={14}>
                  <Avatar
                    size={56}
                    style={{
                      background: "#1677ff",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(displayName) || <UserOutlined />}
                  </Avatar>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {displayName}
                    </Title>
                    <Text type="secondary">
                      {displayEmail} - {displayPhone}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Row justify="space-between" style={{ marginBottom: 6 }}>
                  <Text type="secondary">{"Hi\u1ec7u su\u1ea5t"}</Text>
                  <Text strong>{performance}%</Text>
                </Row>
                <Progress
                  percent={performance}
                  showInfo={false}
                  strokeColor="#1677ff"
                  trailColor="#edf0f3"
                />
              </Col>
            </Row>
          </Card>

          {stats ? (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Card style={STAT_STYLE}>
                    <Statistic
                      title={"T\u1ed5ng Doanh Thu"}
                      value={stats.totalRevenue || 0}
                      formatter={(value) => formatCurrency(Number(value))}
                      prefix={<DollarOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card style={STAT_STYLE}>
                    <Statistic
                      title={"Doanh Thu B\u00e1n"}
                      value={stats.revenueSale || 0}
                      formatter={(value) => formatCurrency(Number(value))}
                      prefix={<ShoppingCartOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card style={STAT_STYLE}>
                    <Statistic
                      title={"Doanh Thu Thu\u00ea"}
                      value={stats.revenueRent || 0}
                      formatter={(value) => formatCurrency(Number(value))}
                      prefix={<RiseOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Card style={STAT_STYLE}>
                    <Statistic
                      title={"T\u1ed5ng Giao D\u1ecbch"}
                      value={stats.totalDeals || 0}
                      prefix={<FileDoneOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card style={STAT_STYLE}>
                    <Statistic
                      title={"Giao D\u1ecbch B\u00e1n"}
                      value={stats.totalSaleDeals || 0}
                      prefix={<FileDoneOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card style={STAT_STYLE}>
                    <Statistic
                      title={"Giao D\u1ecbch Thu\u00ea"}
                      value={stats.totalRentDeals || 0}
                      prefix={<FileDoneOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <StaffChartSection
                activeTab={activeChartTab}
                month={selectedChartMonth}
                onMonthChange={handleChartMonthChange}
                onTabChange={setActiveChartTab}
                revenueData={revenueChartData}
                stats={stats}
              />
            </>
          ) : (
            <Card style={STAT_STYLE}>
              <Text type="secondary">
                {"Ch\u01b0a c\u00f3 d\u1eef li\u1ec7u th\u1ed1ng k\u00ea."}
              </Text>
            </Card>
          )}
        </Space>
      </Spin>
    </div>
  );
};

export default StaffDashboardIndex;
