import React, { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Typography,
  Input,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Checkbox,
  Divider,
  Pagination,
  Space,
  Spin,
  message,
  Tooltip,
  Empty,
} from "antd";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import MatchedBuildingItem from "../../components/staff/MatchedBuildingItem";
import type { MatchingPayload, UserDTO } from "../../types/user.type";
import client from "../../api/axiosClient";
import type {
  MatchingResponseDTO,
  SuggestedBuildingDTO,
} from "../../types/building.type";
import { matchCustomerRequest } from "../../api/userApi";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const PRIMARY = "#1677ff";
const MUTED = "#8c8c8c";
const RED_ALERT = "#EA0000";

// Status mapping
const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "Chưa tiếp nhận", color: "default" },
  PENDING: { label: "Chưa tiếp nhận", color: "default" },
  ASSIGNED: { label: "Đã phân công", color: "processing" },
  CONSULTING: { label: "Đang tư vấn", color: "processing" },
  SIGNED: { label: "Đã kí hợp đồng", color: "warning" },
  PAID: { label: "Đã thanh toán", color: "success" },
};

const statusTag = (status: string | undefined) => {
  const normalizedStatus = status?.toUpperCase().trim() || "PENDING";
  const config = statusConfig[normalizedStatus] || statusConfig.PENDING;
  return <Tag color={config.color}>{config.label}</Tag>;
};

const Assignment: React.FC = () => {
  const [selectedCustomerPage, setSelectedCustomerPage] = useState<number>(1);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<UserDTO[]>([]);

  // States cho Matching
  const [matchedBuildings, setMatchedBuildings] = useState<
    SuggestedBuildingDTO[]
  >([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const pageSize = 5;

  // Fetch customers demand
  const fetchCustomers = async (keyword: string = "") => {
    setLoading(true);
    try {
      const res = await client.get("/api/customer-request");
      const demands = res?.data ?? res;

      if (Array.isArray(demands)) {
        const mappedData = demands.map((d: any) => ({
          ...d,
          id: String(d.customerId || d.id),
        }));
        setCustomers(mappedData);
        setTotalCustomers(mappedData.length);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Logic Matching Hoàn chỉnh ---
  const handleMatching = async (customer: UserDTO) => {
    setIsMatchingLoading(true);
    setSelectedCustomerId(String(customer.id));

    try {
      // 1. Tách địa chỉ từ location (Ví dụ: "Phường Bến Nghé, Hồ Chí Minh")
      const rawLocation = (customer as UserDTO).demand?.location || "";
      const locationParts = rawLocation.split(",").map((s: string) => s.trim());
      const ward = locationParts[0] || "";
      const province = locationParts[1] || "";

      // 2. Chuẩn bị payload chuẩn theo API
      const payload: MatchingPayload = {
        customerId: Number(customer.id),
        transactionType: "BOTH", 
        desiredPriceSale: Number((customer as UserDTO).demand?.price || 0),
        desiredArea: Number((customer as UserDTO).demand?.area || 0),
        desiredWard: ward,
        desiredProvince: province,
        buildingType: (customer as UserDTO).demand?.propertyType || "Căn hộ",
        priorityType: "DEFAULT",
        priceTolerance: 0.2,
        areaTolerance: 0.2,
        limit: 10,
      };

      // 3. Gọi API matching thực tế
      const response = await matchCustomerRequest(payload);
      console.log("Dữ liệu nhận được:", response);

      const responseData = response?.data || response;
      const suggested = responseData?.suggestedBuildings || [];

    if (suggested && suggested.length > 0) {
      const sorted = [...suggested].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      setMatchedBuildings(sorted);
      message.success(`Tìm thấy ${suggested.length} tòa nhà phù hợp`);
    } else {
      setMatchedBuildings([]);
      message.warning("Không tìm thấy tòa nhà nào phù hợp");
    }
    } catch (error) {
      console.error("Matching error:", error);
      message.error("Lỗi khi tìm kiếm tòa nhà phù hợp");
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setSelectedCustomerPage(1);
    fetchCustomers(value);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Content style={{ padding: 28 }}>
        <Row gutter={24}>
          {/* Left Column: Customers */}
          <Col span={13}>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                ASSIGNMENT
              </Title>
              <Text style={{ color: MUTED }}>Welcome to Estate Advance</Text>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Search
                placeholder="Tìm khách hàng..."
                allowClear
                onSearch={handleSearch}
                style={{ borderRadius: 24, width: "100%" }}
              />
            </div>

            <Spin spinning={loading}>
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                {customers
                  .slice(
                    (selectedCustomerPage - 1) * pageSize,
                    selectedCustomerPage * pageSize,
                  )
                  .map((c: UserDTO) => {
                    const isExpanded = expandedCustomerIds.includes(
                      String(c.id),
                    );
                    const isSelected = selectedCustomerId === String(c.id);

                    return (
                      <Card
                        key={c.id}
                        bodyStyle={{ padding: 12 }}
                        style={{
                          border: isSelected
                            ? `1px solid ${PRIMARY}`
                            : "1px solid #f0f0f0",
                        }}
                      >
                        <Row align="middle">
                          <Col span={10}>
                            <Space size={12}>
                              <Avatar
                                size={48}
                                style={{ background: "#E6F6FF", color: "#000" }}
                              >
                                {c.fullName?.charAt(0) || "?"}
                              </Avatar>
                              <div>
                                <Text strong style={{ display: "block" }}>
                                  {c.fullName}
                                </Text>
                                <Text style={{ color: MUTED }}>
                                  @{c.userName || "N/A"}
                                </Text>
                              </div>
                            </Space>
                          </Col>
                          <Col span={8}>
                            <Button
                              type="primary"
                              shape="round"
                              style={{ background: PRIMARY, width: "100%" }}
                              onClick={() =>
                                setExpandedCustomerIds((prev) =>
                                  prev.includes(String(c.id))
                                    ? prev.filter((id) => id !== String(c.id))
                                    : [...prev, String(c.id)],
                                )
                              }
                            >
                              Chi tiết nhu cầu
                            </Button>
                          </Col>
                          <Col span={6} style={{ textAlign: "right" }}>
                            {statusTag(c.status)}
                          </Col>
                        </Row>

                        {isExpanded && (
                          <div
                            style={{
                              marginTop: 12,
                              padding: 12,
                              background: "#fafafa",
                              borderRadius: 8,
                            }}
                          >
                            <Row gutter={[12, 12]}>
                              <Col span={12}>
                                <Text type="secondary">Mức giá:</Text>{" "}
                                <Text strong>
                                  {new Intl.NumberFormat("vi-VN").format(
                                    Number((c as UserDTO).demand?.price || 0),
                                  )}{" "}
                                  đ
                                </Text>
                              </Col>
                              <Col span={12}>
                                <Text type="secondary">Diện tích:</Text>{" "}
                                <Text strong style={{ color: RED_ALERT }}>
                                  {(c as UserDTO).demand?.area} m²
                                </Text>
                              </Col>
                              <Col span={24}>
                                <Text type="secondary">
                                  <EnvironmentOutlined /> Vị trí:
                                </Text>{" "}
                                <Text strong>
                                  {(c as UserDTO).demand?.location}
                                </Text>
                              </Col>
                            </Row>
                            <Divider style={{ margin: "12px 0" }} />
                            <Button
                              icon={<ThunderboltOutlined />}
                              onClick={() => handleMatching(c)}
                              loading={
                                isMatchingLoading &&
                                selectedCustomerId === String(c.id)
                              }
                            >
                              Matching
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
              </Space>
            </Spin>

            <Pagination
              current={selectedCustomerPage}
              pageSize={pageSize}
              total={totalCustomers}
              onChange={setSelectedCustomerPage}
              style={{ textAlign: "center", marginTop: 16 }}
            />
          </Col>

          {/* Right Column: Matched Buildings */}
          <Col span={11}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Tòa nhà phù hợp</span>
                  <Button
                    type="primary"
                    shape="round"
                    disabled={selectedBuildingIds.length === 0}
                  >
                    Gửi khách hàng
                  </Button>
                </div>
              }
              style={{
                borderRadius: 16,
                height: "calc(100vh - 56px)",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{ flex: 1, overflowY: "auto", padding: 16 }}
            >
              <Spin spinning={isMatchingLoading}>
                {matchedBuildings.length > 0 ? (
                  <Checkbox.Group
                    value={selectedBuildingIds}
                    onChange={(vals) =>
                      setSelectedBuildingIds(vals as string[])
                    }
                    style={{ width: "100%" }}
                  >
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size={16}
                    >
                      {matchedBuildings.map((b) => (
                        <div
                          key={b.buildingId}
                          style={{ position: "relative" }}
                        >
                          <Checkbox
                            value={String(b.buildingId)}
                            style={{ width: "100%" }}
                          >
                            <MatchedBuildingItem building={b} />
                          </Checkbox>
                        </div>
                      ))}
                    </Space>
                  </Checkbox.Group>
                ) : (
                  <Empty
                    description="Không tìm thấy tòa nhà hoặc chưa sử dụng Matching"
                    style={{ marginTop: 60 }}
                  />
                )}
              </Spin>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Assignment;
