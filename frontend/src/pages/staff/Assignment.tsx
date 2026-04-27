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
} from "antd";

import BuildingCard from "../../components/staff/BuildingCard";
import type { UserDTO } from "../../types/user.type";
import client from "../../api/axiosClient";
// import buildingApi, { searchBuildings } from "../../api/buildingApi";
import type {
  BuildingDTO,
  BuildingSearchRequest,
  BuildingSearchResponse,
} from "../../types/building.type";
import { mockBuildingsData } from "./mockBuildingsData";

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
  "Đang tư vấn": { label: "Đang tư vấn", color: "processing" },
  SIGNED: { label: "Đã kí hợp đồng", color: "warning" },
  "Đã kí hợp đồng": { label: "Đã kí hợp đồng", color: "warning" },
  PAID: { label: "Đã thanh toán", color: "success" },
  "Đã thanh toán": { label: "Đã thanh toán", color: "success" },
};

const statusTag = (status: string | undefined) => {
  const normalizedStatus = status?.toUpperCase().trim() || "PENDING";
  const config =
    statusConfig[normalizedStatus] ||
    statusConfig[status || ""] ||
    statusConfig.PENDING;
  return <Tag color={config.color}>{config.label}</Tag>;
};

const Assignment: React.FC = () => {
  const [selectedCustomerPage, setSelectedCustomerPage] = useState<number>(1);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [buildingLoading, setBuildingLoading] = useState(false);
  const [customers, setCustomers] = useState<UserDTO[]>([]);
  const [buildings, setBuildings] = useState<BuildingSearchResponse[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const pageSize = 5;

  // Fetch customers demand
  const fetchCustomers = async (keyword: string = "", page: number = 1) => {
    setLoading(true);
    try {
      const [resDemand, resCustomer] = await Promise.all([
        client.get("/api/customer-request"),
        client.get("/api/customer"),
      ]);

      const demands = resDemand?.data ?? resDemand;
      const customersList = resCustomer?.data ?? resCustomer;

      const map = new Map<string, any>();

      // 1. Đưa thông tin khách hàng vào Map trước (để lấy status và info chuẩn từ DB)
      if (Array.isArray(customersList)) {
        customersList.forEach((c: any) => {
          map.set(String(c.id), { ...c });
        });
      }

      // 2. DUYỆT QUA MẢNG DEMANDS (API request) để gộp nhu cầu vào khách hàng
      if (Array.isArray(demands)) {
        demands.forEach((d: any) => {
          const id = String(d.id ?? d.customerId ?? "");
          if (!id) return;

          if (map.has(id)) {
            const existing = map.get(id);
            // Gộp object demand từ request vào thông tin khách hàng
            existing.demand = d.demand;
            // Ưu tiên giữ status từ bảng Customer vì bạn đã fix logic update status ở Backend
            map.set(id, existing);
          } else {
            // Trường hợp có request nhưng chưa có trong bảng customer (nếu có)
            map.set(id, {
              id,
              fullName: d.fullName ?? "",
              demand: d.demand,
              status: d.status || "NEW",
            });
          }
        });
      }

      const allCustomers = Array.from(map.values()) as UserDTO[];
      setCustomers(allCustomers);
      setTotalCustomers(allCustomers.length);
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      console.error(error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch buildings - get buildings to match with customer demands
  const fetchBuildings = async (page = 1, kw = "") => {
    setBuildingLoading(true);
    try {
      // TODO: Enable this when API is tested
      // const params: BuildingSearchRequest = {
      //   name: kw || "",
      //   page: page,
      //   size: pageSize,
      // };
      // const res = await buildingApi.searchBuildings(params);
      // if (Array.isArray(res)) {
      //   setBuildings(res as BuildingSearchResponse[]);
      // } else {
      //   setBuildings([]);
      // }

      // Using mock data for now
      console.log("Using mock building data");
      setBuildings(mockBuildingsData as BuildingSearchResponse[]);
    } catch (err) {
      console.error("Error fetching buildings", err);
      message.error("Lấy danh sách tòa nhà thất bại");
    } finally {
      setBuildingLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomers("", 1);
    fetchBuildings();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    setSelectedCustomerPage(1);
    fetchCustomers(value, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSelectedCustomerPage(page);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Content style={{ padding: 28 }}>
        <Row gutter={24}>
          {/* Left column: customers list */}
          <Col span={13}>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                ASSIGNMENT
              </Title>
              <Text style={{ color: MUTED }}>Welcome to Estate Advance</Text>
            </div>

            <div style={{ marginTop: 12, marginBottom: 20 }}>
              <Search
                placeholder="Tìm khách hàng"
                allowClear
                enterButton
                onSearch={(val) => handleSearch(val)}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ borderRadius: 24, width: 520 }}
                value={search}
              />
            </div>

            <Spin spinning={loading}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {customers
                  .slice(
                    (selectedCustomerPage - 1) * pageSize,
                    selectedCustomerPage * pageSize,
                  )
                  .map((c: UserDTO) => {
                    const isExpanded = expandedCustomerIds.includes(
                      String(c.id),
                    );
                    return (
                      <Card key={c.id} bodyStyle={{ padding: 12 }}>
                        <Row align="middle" style={{ width: "100%" }}>
                          <Col span={10}>
                            <Row align="middle" gutter={12}>
                              <Col>
                                <Avatar
                                  size={48}
                                  style={{
                                    background: "#E6F6FF",
                                    color: "#000",
                                  }}
                                >
                                  {c.fullName?.charAt(0) || "?"}
                                </Avatar>
                              </Col>
                              <Col>
                                <Text strong style={{ display: "block" }}>
                                  {c.fullName || "N/A"}
                                </Text>
                                <Text style={{ color: MUTED }}>
                                  @{c.userName || "N/A"}
                                </Text>
                              </Col>
                            </Row>
                          </Col>

                          <Col span={8}>
                            <Button
                              type="primary"
                              shape="round"
                              style={{
                                background: PRIMARY,
                                borderColor: PRIMARY,
                                width: "100%",
                              }}
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
                                    <Text
                                      type="secondary"
                                      style={{ color: MUTED }}
                                    >
                                      Mức giá
                                    </Text>
                                    <Text strong>
                                      {c.demand?.price
                                        ? new Intl.NumberFormat("vi-VN").format(
                                            c.demand.price as number,
                                          ) + " đ"
                                        : "-"}
                                    </Text>
                                  </div>
                                </Col>
                                {/* <Space>
                                  {(c as DemandDTO)?.priority && (
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
                                    <Text
                                      type="secondary"
                                      style={{ color: MUTED }}
                                    >
                                      Diện tích
                                    </Text>
                                    <Text strong style={{ color: RED_ALERT }}>
                                      {c.demand?.area
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
                                    <Text
                                      type="secondary"
                                      style={{ color: MUTED }}
                                    >
                                      Vị trí
                                    </Text>
                                    <Text>{c.demand?.location || "-"}</Text>
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
                                    <Text
                                      type="secondary"
                                      style={{ color: MUTED }}
                                    >
                                      Loại nhà đất
                                    </Text>
                                    <Text>
                                      {c.demand?.propertyType || "Chung cư"}
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
              </div>
            </Spin>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Pagination
                current={selectedCustomerPage}
                pageSize={pageSize}
                total={totalCustomers}
                onChange={handlePageChange}
              />
            </div>
          </Col>

          {/* Right column: matched buildings panel */}
          <Col span={11}>
            <Card
              style={{
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                height: "calc(100vh - 56px)",
                display: "flex",
                flexDirection: "column",
                padding: 16,
              }}
              bodyStyle={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    Toà nhà phù hợp
                  </Title>
                </div>

                <Button
                  type="primary"
                  shape="round"
                  style={{ background: PRIMARY, borderColor: PRIMARY }}
                >
                  Gửi khách hàng
                </Button>
              </div>

              <Divider style={{ margin: "8px 0 12px 0" }} />

              <Spin spinning={buildingLoading}>
                <div style={{ overflowY: "auto", flex: 1, paddingRight: 8 }}>
                  {buildings && buildings.length > 0 ? (
                    <Checkbox.Group
                      value={selectedBuildingIds}
                      onChange={(vals) =>
                        setSelectedBuildingIds(vals as string[])
                      }
                      style={{ width: "100%" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {buildings.map((b) => (
                          <div key={b.id} style={{ width: "100%" }}>
                            <Checkbox
                              value={String(b.id)}
                              style={{ width: "100%" }}
                            >
                              <BuildingCard
                                building={b}
                                variant="horizontal"
                                thumbnailWidth={140}
                              />
                            </Checkbox>
                          </div>
                        ))}
                      </Space>
                    </Checkbox.Group>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: MUTED,
                      }}
                    >
                      <Text>Không có toà nhà nào</Text>
                    </div>
                  )}
                </div>
              </Spin>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Assignment;
