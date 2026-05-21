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
  Empty,
} from "antd";
import MatchedBuildingItem from "../../components/staff/MatchedBuildingItem";
import type { MatchingPayload, UserDemandDTO} from "../../types/user.type";
import client from "../../api/axiosClient";
import type {
  SuggestedBuildingDTO,
} from "../../types/building.type";
import { matchCustomerRequest } from "../../api/userApi";
import { formatPrice } from "../../utils/assignmentUtils";

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

const propertyTypeConfig: Record<string, string> = {
  APARTMENT: "Căn hộ",
  RETAIL: "Mặt bằng kinh doanh",
  WAREHOUSE: "Kho bãi",
  OFFICE: "Văn phòng",
}

 const getPropertyTypeLabel = (propertyType: string | undefined) => {
    return propertyTypeConfig[propertyType || ""] || propertyType || "Không xác định";
  };


const Assignment: React.FC = () => {
  const [selectedCustomerPage, setSelectedCustomerPage] = useState<number>(1);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<string[]>([]);
  // const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<UserDemandDTO[]>([]);

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
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const staffInfoStr = localStorage.getItem("staff_info");
      if (!staffInfoStr) {
        message.error("Không tìm thấy thông tin định danh nhân viên. Vui lòng đăng nhập lại.");
        setCustomers([]);
        return;
      }
      
      const staffInfo = JSON.parse(staffInfoStr);
      const staffId = staffInfo.id;

      if (!staffId) {
        message.error("Mã số nhân viên không hợp lệ.");
        setCustomers([]);
        return;
      }

      const res = await client.get(`/api/customer-request/staff/${staffId}`);
      const demands = res?.data ?? res;

      const demandArray = Array.isArray(demands) ? demands : [];

      setCustomers(demandArray);
      setTotalCustomers(demandArray.length);
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      setCustomers([]);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Logic Matching Hoàn chỉnh ---
  const handleMatching = async (customer: UserDemandDTO) => {
    setIsMatchingLoading(true);
    setSelectedCustomerId(String(customer.id));

    try {

      // 1. Chuẩn bị payload chuẩn theo API
      const payload: MatchingPayload = {
        customerId: Number(customer.id),
        transactionType: "BOTH", 
        desiredPriceSale: Number(customer.demand?.price || 0),
        desiredArea: Number(customer.demand?.area || 0),
        desiredWard: customer.demand?.ward,
        desiredProvince: customer.demand?.province,
        buildingType: customer.demand?.propertyType || "Căn hộ",
        priorityType: customer.demand?.priorityType || "DEFAULT",
        priceTolerance: 0.2,
        areaTolerance: 0.2,
        limit: 10,
      };

      // 3. Gọi API matching thực tế
      const response = await matchCustomerRequest(payload);
      console.log("Dữ liệu nhận được:", response);

      const responseData = response as unknown as { suggestedBuildings?: SuggestedBuildingDTO[] };
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
                // onSearch={handleSearch}
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
                  .map((c) => {
                    const isExpanded = expandedCustomerIds.includes(
                      String(c.id),
                    );
                    const isSelected = selectedCustomerId === String(c.id);
                    const currentPriority = c?.demand?.priorityType?.toUpperCase() || "";
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
                          <>
                          <Divider style={{ margin: "12px 0" }} />
                                                <Card
                                                  type="inner"
                                                  style={{
                                                    borderRadius: 8,
                                                    border: "1px solid #f0f0f0",
                                                    boxShadow: "none",
                                                  }}
                                                >
                                                  <Row gutter={[12, 12]}>
                                                    <Col span={12}>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "space-between",
                                                          marginBottom: 8,
                                                        }}
                                                      >
                                                        <Text type="secondary" style={{ color: "black" }}>
                                                          Mức giá
                                                        </Text>
                                                        {currentPriority === "SAVINGS" && (
                                                        <Tag color="cyan" style={{ fontSize: "11px", lineHeight: "16px" }}>Ưu tiên</Tag>
                                                        )}
                                                        <Text strong >
                                                          {formatPrice(c?.demand?.price)}
                                                        </Text>
                                                      </div>
                                                    </Col>
                                                    {/* <Space>
                                                      {(customer as UserDTO).priority && (
                                                        <Tag color="success">Ưu tiên</Tag>
                                                      )}
                                                    </Space> */}
                                                  </Row>
                          
                                                  <Row gutter={[12, 12]}>
                                                    <Col span={12}>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "space-between",
                                                          marginBottom: 8,
                                                        }}
                                                      >
                                                        <Text type="secondary" style={{ color: "black" }}>
                                                          Diện tích
                                                        </Text>
                                                        {currentPriority === "SPACE" && (
                                                        <Tag color="volcano" style={{ fontSize: "11px", lineHeight: "16px" }}>Ưu tiên</Tag>
                                                        )}
                                                        <Text strong style={{ color: RED_ALERT }}>
                                                          {c?.demand?.area
                                                            ? `${c.demand.area} m²`
                                                            : "-"}
                                                        </Text>
                                                      </div>
                                                    </Col>
                                                  </Row>
                          
                                                  <Row gutter={[12, 12]}>
                                                    <Col span={12}>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "space-between",
                                                          marginBottom: 8,
                                                        }}
                                                      >
                                                        <Text type="secondary" style={{ color: "black" }}>
                                                          Vị trí
                                                        </Text>
                                                        {currentPriority === "PROFIT" && (
                                                        <Tag color="volcano" style={{ fontSize: "11px", lineHeight: "16px" }}>Ưu tiên</Tag>
                                                        )}
                                                        <Text>
                                                          <strong>
                                                            {c?.demand?.ward || "-"}, {c?.demand?.province || "-"}
                                                          </strong>
                                                        </Text>
                                                      </div>
                                                    </Col>
                                                  </Row>
                          
                                                  <Row gutter={[12, 12]}>
                                                    <Col span={12}>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "space-between",
                                                          marginBottom: 8,
                                                        }}
                                                      >
                                                        <Text type="secondary" style={{ color: "black" }}>
                                                          Loại nhà đất
                                                        </Text>
                                                        <Text>
                                                          <strong>
                                                            {getPropertyTypeLabel(c?.demand?.propertyType) || "Chung cư"}
                                                          </strong>
                                                        </Text>
                                                      </div>
                                                    </Col>
                                                  </Row>
                          
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      alignItems: "center",
                                                      marginTop: 12,
                                                    }}
                                                  >
                                                    <Button
                                                      style={{
                                                        background: "#fff",
                                                        color: "#666",
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                                      }}
                                                      onClick={() => handleMatching(c as UserDemandDTO)}
                                                    >
                                                      Matching
                                                    </Button>
                                                  </div>
                                                </Card>
                                                </>
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
