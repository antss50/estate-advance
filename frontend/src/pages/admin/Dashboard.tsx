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
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  RiseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import administrativeApi from "../../api/administrativeApi";
import type { DashboardResponse, TopStaff } from "../../types";

const { Text, Title } = Typography;

type ChartTab = "revenue" | "staffPerformance";

interface RevenueChartPoint {
  day: number;
  revenue: number;
}

interface StaffPerformanceChartItem {
  staffId: number;
  staffName: string;
  revenue: number;
  totalDeals: number;
}

const STAT_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
};

const TOP_STAFF_SECTION_STYLE: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eef1f4",
  borderRadius: 12,
  padding: 20,
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

const RANK_META: Record<
  number,
  {
    accent: string;
    background: string;
    label: string;
  }
> = {
  1: {
    accent: "#c9972b",
    background: "linear-gradient(135deg, #fff9e8 0%, #ffffff 62%)",
    label: "Top 1",
  },
  2: {
    accent: "#6d7d8d",
    background: "linear-gradient(135deg, #f2f6f9 0%, #ffffff 62%)",
    label: "Top 2",
  },
  3: {
    accent: "#b66f3a",
    background: "linear-gradient(135deg, #fff3ea 0%, #ffffff 62%)",
    label: "Top 3",
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatMillion = (value: number) => `${Math.round(value / 1_000_000)} M`;

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

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

const buildRevenueChartData = (
  stats?: DashboardResponse | null,
): RevenueChartPoint[] => {
  const staffRevenue = stats?.totalStaffRevenue || 0;
  const systemRevenue = stats?.totalSystemRevenue || 0;
  const totalRevenue = stats?.totalRevenue || staffRevenue + systemRevenue;

  return [
    { day: 1, revenue: 0 },
    { day: 12, revenue: staffRevenue },
    { day: 22, revenue: staffRevenue + systemRevenue },
    { day: 30, revenue: totalRevenue },
  ];
};

const buildAxisValues = (maxRevenue: number) => {
  const rawValues = [0.8, 0.6, 0.4, 0.2].map((ratio) =>
    Math.round((maxRevenue * ratio) / 1_000_000) * 1_000_000,
  );

  return Array.from(new Set(rawValues.filter((value) => value > 0)));
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
  const height = 360;
  const maxRevenue = Math.max(...data.map((point) => point.revenue), 1);
  const path = toRevenuePath(data, width, height, maxRevenue);
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;
  const yAxisValues = buildAxisValues(maxRevenue);
  const xAxisValues = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        width="100%"
        viewBox="0 0 1060 470"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        style={{ minWidth: 760 }}
      >
        <defs>
          <linearGradient id="revenueAreaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1499f3" stopOpacity="0.92" />
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
                <text fill="#18212f" fontSize={12} textAnchor="middle" x={x} y={height + 36}>
                  {day}th
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#revenueAreaGradient)" />
          <path d={path} fill="none" stroke="#1499f3" strokeLinecap="round" strokeWidth={5} />

          {data.slice(1, -1).map((point) => {
            const x = ((point.day - 1) / 29) * width;
            const y = height - (point.revenue / maxRevenue) * height;
            return (
              <g key={point.day}>
                <line
                  stroke="#aeb8c2"
                  strokeDasharray="4 4"
                  x1={x}
                  x2={x}
                  y1={y}
                  y2={height}
                />
                <circle cx={x} cy={y} fill="#fff" r={5} stroke="#095cff" strokeWidth={2} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const StaffPerformanceChart: React.FC<{ data: StaffPerformanceChartItem[] }> = ({
  data,
}) => {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);
  const axisValues = [10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000];
  const rowHeight = 72;

  if (!data.length) {
    return (
      <Card style={{ borderRadius: 12 }}>
        <Text type="secondary">
          {"Ch\u01b0a c\u00f3 d\u1eef li\u1ec7u hi\u1ec7u su\u1ea5t nh\u00e2n vi\u00ean."}
        </Text>
      </Card>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "128px minmax(620px, 1fr)",
          minWidth: 760,
          paddingTop: 20,
        }}
      >
        <div>
          {data.map((item) => (
            <div
              key={item.staffId}
              style={{
                alignItems: "center",
                display: "flex",
                height: rowHeight,
                paddingRight: 20,
              }}
            >
              <div>
                <Text strong style={{ display: "block" }}>
                  {item.staffName}
                </Text>
                <Text type="secondary">#staff{String(item.staffId).padStart(3, "0")}</Text>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderLeft: "1px solid #aeb8c2",
            position: "relative",
          }}
        >
          {axisValues.map((value) => (
            <div
              key={value}
              style={{
                borderLeft: "1px solid #d4d9df",
                height: data.length * rowHeight,
                left: `${(value / 50_000_000) * 100}%`,
                position: "absolute",
                top: 0,
              }}
            />
          ))}

          {data.map((item, index) => (
            <div
              key={item.staffId}
              style={{
                alignItems: "center",
                display: "flex",
                height: rowHeight,
                position: "relative",
              }}
            >
              <div
                style={{
                  background: "#1298ee",
                  height: 42,
                  width: `${item.revenue > 0 ? (item.revenue / maxRevenue) * 86 : 0}%`,
                }}
              />
              {index === 0 ? (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #d4d9df",
                    borderRadius: 4,
                    boxShadow: "0 8px 18px rgba(31, 45, 61, 0.08)",
                    left: "65%",
                    padding: "12px 14px",
                    position: "absolute",
                    top: -28,
                    width: 190,
                    zIndex: 2,
                  }}
                >
                  <Text type="secondary" style={{ display: "block", fontSize: 11 }}>
                    {"T\u1ed5ng s\u1ed1 giao d\u1ecbch: "}
                    <Text strong>{item.totalDeals}</Text>
                  </Text>
                  <Text type="secondary" style={{ display: "block", fontSize: 11, marginTop: 8 }}>
                    {"Doanh thu: "}
                    <Text strong>{formatCurrency(item.revenue)}</Text>
                  </Text>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div />
        <div
          style={{
            borderTop: "1px solid #aeb8c2",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            paddingTop: 20,
          }}
        >
          {axisValues.map((value) => (
            <Text key={value} style={{ fontSize: 12, textAlign: "center" }}>
              {formatMillion(value)}
            </Text>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardChartSection: React.FC<{
  activeTab: ChartTab;
  month: number;
  revenueData: RevenueChartPoint[];
  staffPerformanceData: StaffPerformanceChartItem[];
  onMonthChange: (month: number) => void;
  onTabChange: (tab: ChartTab) => void;
}> = ({
  activeTab,
  month,
  revenueData,
  staffPerformanceData,
  onMonthChange,
  onTabChange,
}) => (
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
          Doanh thu
        </button>
        <button
          onClick={() => onTabChange("staffPerformance")}
          style={
            activeTab === "staffPerformance"
              ? ACTIVE_CHART_TAB_BUTTON_STYLE
              : CHART_TAB_BUTTON_STYLE
          }
          type="button"
        >
          Hi\u1ec7u su\u1ea5t nh\u00e2n vi\u00ean
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
        <StaffPerformanceChart data={staffPerformanceData} />
      )}
    </Space>
  </section>
);

const TopStaffCard: React.FC<{ staff: TopStaff }> = ({ staff }) => {
  const rankMeta = RANK_META[staff.rank] ?? RANK_META[3];
  const performance = clampPercent(staff.performance || 0);

  return (
    <Card
      style={{
        height: "100%",
        border: `1px solid ${rankMeta.accent}33`,
        borderRadius: 12,
        background: rankMeta.background,
        boxShadow: "0 10px 28px rgba(31, 45, 61, 0.08)",
      }}
      styles={{ body: { padding: 18 } }}
    >
      <Space direction="vertical" size={14} style={{ width: "100%" }}>
        <Row justify="space-between" align="top" gutter={12}>
          <Col flex="auto" style={{ minWidth: 0 }}>
            <Space align="center" size={12}>
              <Avatar
                size={48}
                style={{
                  background: rankMeta.accent,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {getInitials(staff.staffName)}
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: 16,
                    lineHeight: "22px",
                    wordBreak: "break-word",
                  }}
                >
                  {staff.staffName}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {"Chuy\u00ean vi\u00ean b\u1ea5t \u0111\u1ed9ng s\u1ea3n"}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <div
              style={{
                alignItems: "center",
                background: `${rankMeta.accent}14`,
                border: `1px solid ${rankMeta.accent}40`,
                borderRadius: 999,
                color: rankMeta.accent,
                display: "flex",
                fontSize: 12,
                fontWeight: 700,
                gap: 6,
                padding: "5px 10px",
              }}
            >
              <TrophyOutlined />
              {rankMeta.label}
            </div>
          </Col>
        </Row>

        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {"Doanh thu"}
          </Text>
          <div
            style={{
              color: "#18212f",
              fontSize: 22,
              fontWeight: 750,
              lineHeight: "30px",
            }}
          >
            {formatCurrency(staff.revenue || 0)}
          </div>
        </div>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <div
              style={{
                background: "#ffffffb8",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                {"Giao d\u1ecbch"}
              </Text>
              <Text strong>{staff.totalDeals || 0}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: "#ffffffb8",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                {"Hi\u1ec7u su\u1ea5t"}
              </Text>
              <Text strong>{performance}%</Text>
            </div>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <div
              style={{
                background: "#ffffffb8",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                {"Doanh thu b\u00e1n"}
              </Text>
              <Text strong>{formatCurrency(staff.revenueSale || 0)}</Text>
              <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                {`${staff.totalSaleDeals || 0} giao d\u1ecbch`}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: "#ffffffb8",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                {"Doanh thu thu\u00ea"}
              </Text>
              <Text strong>{formatCurrency(staff.revenueRent || 0)}</Text>
              <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                {`${staff.totalRentDeals || 0} giao d\u1ecbch`}
              </Text>
            </div>
          </Col>
        </Row>

        <div>
          <Row justify="space-between" align="middle" style={{ marginBottom: 6 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {"Ti\u1ebfn \u0111\u1ed9 KPI"}
            </Text>
            <RiseOutlined style={{ color: rankMeta.accent }} />
          </Row>
          <Progress
            percent={performance}
            showInfo={false}
            strokeColor={rankMeta.accent}
            trailColor="#edf0f3"
          />
        </div>

        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <MailOutlined style={{ marginRight: 8 }} />
            {staff.email}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            {staff.phone}
          </Text>
        </Space>
      </Space>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("revenue");
  const [selectedChartMonth, setSelectedChartMonth] = useState(1);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartPoint[]>(
    buildRevenueChartData(null),
  );
  const [staffPerformanceChartData, setStaffPerformanceChartData] = useState<
    StaffPerformanceChartItem[]
  >([]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await administrativeApi.getStatistics();
      const topStaffResponse = res.topStaffs ?? [];
      setStats(res);
      setRevenueChartData(buildRevenueChartData(res));
      setStaffPerformanceChartData(
        topStaffResponse.slice(0, 5).map((staff) => ({
          staffId: staff.staffId,
          staffName: staff.staffName,
          revenue: staff.revenue,
          totalDeals: staff.totalDeals,
        })),
      );
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const topStaffs = (stats?.topStaffs ?? []).slice(0, 3);

  const handleChartMonthChange = (month: number) => {
    setSelectedChartMonth(month);
    setRevenueChartData(buildRevenueChartData(stats));
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 18 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Dashboard
          </Title>
        </Col>
      </Row>

      {loading ? (
        <Spin tip="Loading dashboard..." />
      ) : stats ? (
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"T\u1ed5ng Doanh Thu"}
                  value={stats.totalRevenue || 0}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Doanh Thu Nh\u00e2n Vi\u00ean"}
                  value={stats.totalStaffRevenue || 0}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Doanh Thu H\u1ec7 Th\u1ed1ng"}
                  value={stats.totalSystemRevenue || 0}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"T\u1ed5ng Giao D\u1ecbch"}
                  value={stats.totalDeals || 0}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Giao D\u1ecbch B\u00e1n"}
                  value={stats.totalSaleDeals || 0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Giao D\u1ecbch Thu\u00ea"}
                  value={stats.totalRentDeals || 0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Kh\u00e1ch H\u00e0ng"}
                  value={stats.totalCustomers || 0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Kh\u00e1ch \u0110\u00e3 Thanh To\u00e1n"}
                  value={stats.totalPaidCustomers || 0}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Kh\u00e1ch \u0110ang Ho\u1ea1t \u0110\u1ed9ng"}
                  value={stats.totalActiveCustomers || 0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={STAT_STYLE}>
                <Statistic
                  title={"Kh\u00e1ch H\u00e0ng M\u1edbi"}
                  value={stats.totalNewCustomers || 0}
                />
              </Card>
            </Col>
          </Row>

          <section style={TOP_STAFF_SECTION_STYLE}>
            <Row
              justify="space-between"
              align="middle"
              gutter={[16, 12]}
              style={{ marginBottom: 16 }}
            >
              <Col>
                <Space direction="vertical" size={0}>
                  <Title level={5} style={{ margin: 0 }}>
                    {"Top 3 nh\u00e2n vi\u00ean"}
                  </Title>
                  <Text type="secondary">
                    {"Hi\u1ec7u qu\u1ea3 kinh doanh n\u1ed5i b\u1eadt trong h\u1ec7 th\u1ed1ng"}
                  </Text>
                </Space>
              </Col>
              <Col>
                <div
                  style={{
                    alignItems: "center",
                    background: "#f4f7f9",
                    borderRadius: 999,
                    color: "#516070",
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 600,
                    gap: 8,
                    padding: "8px 12px",
                  }}
                >
                  <TrophyOutlined />
                  {"B\u1ea3ng x\u1ebfp h\u1ea1ng doanh thu"}
                </div>
              </Col>
            </Row>

            {topStaffs.length ? (
              <Row gutter={[16, 16]}>
                {topStaffs.map((staff) => (
                  <Col xs={24} lg={8} key={staff.staffId}>
                    <TopStaffCard staff={staff} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card style={{ borderRadius: 12 }}>
                <Text type="secondary">
                  {"Ch\u01b0a c\u00f3 d\u1eef li\u1ec7u nh\u00e2n vi\u00ean n\u1ed5i b\u1eadt."}
                </Text>
              </Card>
            )}
          </section>

          <DashboardChartSection
            activeTab={activeChartTab}
            month={selectedChartMonth}
            onMonthChange={handleChartMonthChange}
            onTabChange={setActiveChartTab}
            revenueData={revenueChartData}
            staffPerformanceData={staffPerformanceChartData}
          />

          
        </Space>
      ) : null}
    </div>
  );
};

export default Dashboard;
