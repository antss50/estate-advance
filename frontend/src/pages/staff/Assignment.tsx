import React, { useState } from "react";
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
} from "antd";

import { mockBuildings } from "./mockBuildings";
import BuildingCard from "../../components/staff/BuildingCard";
import type { Customer } from "./mockCustomers";
import { mockCustomers } from "./mockCustomers";
const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const PRIMARY = "#1677ff";
const MUTED = "#8c8c8c";
const RED_ALERT = "#EA0000";

const statusTag = (status: Customer["status"]) => {
  switch (status) {
    case "CHUA_TIEP_NHAN":
      return <Tag color="default">Chưa tiếp nhận</Tag>;
    case "DANG_TU_VAN":
      return <Tag color="processing">Đang tư vấn</Tag>;
    case "DA_KI_HOP_DONG":
      return <Tag color="warning">Đã kí hợp đồng</Tag>;
    case "DA_THANH_TOAN":
      return <Tag color="success">Đã thanh toán</Tag>;
    default:
      return <Tag>Chưa tiếp nhận</Tag>;
  }
};

const Assignment: React.FC = () => {
  const [selectedCustomerPage, setSelectedCustomerPage] = useState<number>(1);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  const pageSize = 6;
  const customersToShow = mockCustomers.filter((c: Customer) =>
    (c.name + c.username).toLowerCase().includes(search.trim().toLowerCase()),
  );
  const total = customersToShow.length;
  const pageCustomers = customersToShow.slice(
    (selectedCustomerPage - 1) * pageSize,
    selectedCustomerPage * pageSize,
  );

  //   const onSendToCustomer = () => {
  //     // placeholder: later call API to send selected building to selected customer
  //     if (!selectedBuildingId) {
  //       // no-op for now
  //       return;
  //     }
  //     // future: show success message
  //   };

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
                onSearch={(val) => setSearch(val)}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: 24, width: 520 }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pageCustomers.map((c: Customer) => {
                const isExpanded = expandedCustomerIds.includes(c.id);
                return (
                  <Card key={c.id} bodyStyle={{ padding: 12 }}>
                    <Row align="middle" style={{ width: "100%" }}>
                      <Col span={10}>
                        <Row align="middle" gutter={12}>
                          <Col>
                            <Avatar
                              size={48}
                              style={{ background: "#E6F6FF", color: "#000" }}
                            >
                              {c.name.charAt(0)}
                            </Avatar>
                          </Col>
                          <Col>
                            <Text strong style={{ display: "block" }}>
                              {c.name}
                            </Text>
                            <Text style={{ color: MUTED }}>{c.username}</Text>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={8}>
                        <Button
                          type="primary"
                          shape="round"
                          style={{ background: PRIMARY, borderColor: PRIMARY }}
                          onClick={() =>
                            setExpandedCustomerIds((prev) =>
                              prev.includes(c.id)
                                ? prev.filter((id) => id !== c.id)
                                : [...prev, c.id],
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
                                <Text type="secondary" style={{ color: MUTED }}>
                                  Mức giá
                                </Text>
                                <Text strong>{c.priceRange}</Text>
                              </div>
                            </Col>
                            <Space>
                              {c.priority && <Tag color="success">Ưu tiên</Tag>}
                            </Space>
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
                                <Text type="secondary" style={{ color: MUTED }}>
                                  Diện tích
                                </Text>
                                <Text strong style={{ color: RED_ALERT }}>
                                  {c.areaRange}
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
                                <Text type="secondary" style={{ color: MUTED }}>
                                  Vị trí
                                </Text>
                                <Text>{c.location}</Text>
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
                                <Text type="secondary" style={{ color: MUTED }}>
                                  Loại nhà đất
                                </Text>
                                <Text>{c.propertyType}</Text>
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

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Pagination
                current={selectedCustomerPage}
                pageSize={pageSize}
                total={total}
                onChange={(p) => setSelectedCustomerPage(p)}
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

              <div style={{ overflowY: "auto", flex: 1, paddingRight: 8 }}>
                <Checkbox.Group
                  value={selectedBuildingIds}
                  onChange={(vals) => setSelectedBuildingIds(vals as string[])}
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {mockBuildings.map((b) => (
                      <div key={b.id} style={{ width: "100%" }}>
                        <Checkbox value={b.id} style={{ width: "100%" }}>
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
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Assignment;
