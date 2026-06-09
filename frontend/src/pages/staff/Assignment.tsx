import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import MatchedBuildingItem from "../../components/staff/MatchedBuildingItem";
import client from "../../api/axiosClient";
import { matchCustomerRequest, updateCustomerStatus } from "../../api/userApi";
import { sendBuildingToChat } from "../../hooks/useChat";
import type { SuggestedBuildingDTO } from "../../types/building.type";
import type {
  MatchingPayload,
  UpdateCustomerStatusPayload,
  UserDemandDTO,
} from "../../types/user.type";
import { formatPrice } from "../../utils/assignmentUtils";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const PRIMARY = "#1677ff";
const MUTED = "#8c8c8c";
const RED_ALERT = "#EA0000";
const PAGE_SIZE = 5;

const statusDisplayConfig: Record<
  string,
  { label: string; background: string; color: string }
> = {
  NEW: {
    label: "Ch\u01b0a ti\u1ebfp nh\u1eadn",
    background: "#f5f5f5",
    color: "#595959",
  },
  PENDING: {
    label: "Ch\u01b0a ti\u1ebfp nh\u1eadn",
    background: "#f5f5f5",
    color: "#595959",
  },
  ASSIGNED: {
    label: "\u0110\u00e3 ph\u00e2n c\u00f4ng",
    background: "#e6f4ff",
    color: "#1677ff",
  },
  CONSULTING: {
    label: "\u0110ang t\u01b0 v\u1ea5n",
    background: "#e6f4ff",
    color: "#1677ff",
  },
  SIGNED: {
    label: "\u0110\u00e3 k\u00fd h\u1ee3p \u0111\u1ed3ng",
    background: "#fff7e6",
    color: "#fa8c16",
  },
  PAID: {
    label: "\u0110\u00e3 thanh to\u00e1n",
    background: "#f6ffed",
    color: "#52c41a",
  },
};

const propertyTypeConfig: Record<string, string> = {
  APARTMENT: "C\u0103n h\u1ed9",
  RETAIL: "M\u1eb7t b\u1eb1ng kinh doanh",
  WAREHOUSE: "Kho b\u00e3i",
  OFFICE: "V\u0103n ph\u00f2ng",
};

const transactionTypeOptions = [
  { label: "SALE", value: "SALE" },
  { label: "RENT", value: "RENT" },
];

const renderStatusPill = (status: string) => {
  const config = statusDisplayConfig[status] || statusDisplayConfig.NEW;

  return (
    <span
      style={{
        background: config.background,
        borderRadius: 6,
        color: config.color,
        display: "inline-flex",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "20px",
        padding: "2px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
};

const statusOptions = [
  "NEW",
  "PENDING",
  "ASSIGNED",
  "CONSULTING",
  "SIGNED",
  "PAID",
].map((status) => ({
  disabled: status === "NEW" || status === "PENDING",
  label: renderStatusPill(status),
  value: status,
}));

const normalizeStatus = (status: string | undefined) =>
  status?.toUpperCase().trim() || "NEW";

const getPropertyTypeLabel = (propertyType: string | undefined) =>
  propertyTypeConfig[propertyType || ""] ||
  propertyType ||
  "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh";

const getCurrentStaffId = () => {
  const staffInfoStr = localStorage.getItem("staff_info");
  if (!staffInfoStr) return null;

  const staffInfo = JSON.parse(staffInfoStr);
  return Number(staffInfo.id) || null;
};

const Assignment: React.FC = () => {
  const [selectedCustomerPage, setSelectedCustomerPage] = useState(1);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<UserDemandDTO[]>([]);
  const [matchedBuildings, setMatchedBuildings] = useState<
    SuggestedBuildingDTO[]
  >([]);
  const [matchedCustomer, setMatchedCustomer] = useState<UserDemandDTO | null>(
    null,
  );
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [isSendingBuildings, setIsSendingBuildings] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [statusUpdatingCustomerId, setStatusUpdatingCustomerId] = useState<
    number | null
  >(null);
  const [paidModalCustomer, setPaidModalCustomer] =
    useState<UserDemandDTO | null>(null);
  const [paidBuildingId, setPaidBuildingId] = useState<number | null>(null);
  const [paidTransactionType, setPaidTransactionType] = useState<
    "SALE" | "RENT" | undefined
  >();
  const [paidContractValue, setPaidContractValue] = useState<number | null>(
    null,
  );
  const [paidMonthlyRent, setPaidMonthlyRent] = useState<number | null>(null);
  const [paidContractMonths, setPaidContractMonths] = useState<number | null>(
    null,
  );

  const resetPaidModalState = () => {
    setPaidModalCustomer(null);
    setPaidBuildingId(null);
    setPaidTransactionType(undefined);
    setPaidContractValue(null);
    setPaidMonthlyRent(null);
    setPaidContractMonths(null);
  };

  const patchCustomerStatusInState = (
    customerId: number,
    newStatus: string,
  ) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.customerId === customerId
          ? { ...customer, status: newStatus }
          : customer,
      ),
    );
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const staffId = getCurrentStaffId();

      if (!staffId) {
        message.error(
          "Kh\u00f4ng t\u00ecm th\u1ea5y staffId. Vui l\u00f2ng \u0111\u0103ng nh\u1eadp l\u1ea1i.",
        );
        setCustomers([]);
        return;
      }

      const res = await client.get(`/api/customer-request/staff/${staffId}`);
      const demandArray = Array.isArray(res?.data) ? res.data : [];

      setCustomers(demandArray);
      setTotalCustomers(demandArray.length);
    } catch (error) {
      console.error("Fetch assigned customers error:", error);
      message.error("L\u1ed7i khi t\u1ea3i danh s\u00e1ch kh\u00e1ch h\u00e0ng");
      setCustomers([]);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleMatching = async (customer: UserDemandDTO) => {
    const staffId = getCurrentStaffId();

    if (!staffId) {
      message.error(
        "Không tìm thấy staffId. Vui lòng đăng nhập lại.",
      );
      return;
    }

    setIsMatchingLoading(true);
    setMatchedCustomer(customer);
    setSelectedBuildingIds([]);

    try {
      const payload: MatchingPayload = {
        customerId: Number(customer.customerId),
        staffId,
        demandPrice: Number(customer.demand?.price || 0),
        demandArea: Number(customer.demand?.area || 0),
        demandWard: customer.demand?.ward,
        demandProvince: customer.demand?.province,
        demandPropertyType: customer.demand?.propertyType || "C\u0103n h\u1ed9",
        demandPriorityType: customer.demand?.priorityType || "DEFAULT",
      };

      const response = await matchCustomerRequest(payload);
      const responseData = response as unknown as {
        data?: {
          results?: SuggestedBuildingDTO[];
          suggestedBuildings?: SuggestedBuildingDTO[];
        };
        results?: SuggestedBuildingDTO[];
        suggestedBuildings?: SuggestedBuildingDTO[];
      };
      const suggested =
        responseData.data?.results ||
        responseData.results ||
        responseData.data?.suggestedBuildings ||
        responseData.suggestedBuildings ||
        [];

      if (suggested.length > 0) {
        const sorted = [...suggested].sort(
          (a, b) => (b.totalScore || 0) - (a.totalScore || 0),
        );
        setMatchedBuildings(sorted);
        message.success(
          `T\u00ecm th\u1ea5y ${suggested.length} t\u00f2a nh\u00e0 ph\u00f9 h\u1ee3p`,
        );
      } else {
        setMatchedBuildings([]);
        message.warning(
          "Kh\u00f4ng t\u00ecm th\u1ea5y t\u00f2a nh\u00e0 n\u00e0o ph\u00f9 h\u1ee3p",
        );
      }
    } catch (error) {
      console.error("Matching error:", error);
      message.error(
        "L\u1ed7i khi t\u00ecm ki\u1ebfm t\u00f2a nh\u00e0 ph\u00f9 h\u1ee3p",
      );
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const handleSendBuildingsToCustomer = async () => {
    const staffId = getCurrentStaffId();

    if (!staffId) {
      message.error(
        "Kh\u00f4ng t\u00ecm th\u1ea5y staffId. Vui l\u00f2ng \u0111\u0103ng nh\u1eadp l\u1ea1i.",
      );
      return;
    }

    if (!matchedCustomer?.customerId) {
      message.error("Vui l\u00f2ng matching nhu c\u1ea7u kh\u00e1ch h\u00e0ng tr\u01b0\u1edbc khi g\u1eedi.");
      return;
    }

    if (selectedBuildingIds.length === 0) {
      message.warning("Vui l\u00f2ng ch\u1ecdn t\u00f2a nh\u00e0 \u0111\u1ec3 g\u1eedi.");
      return;
    }

    setIsSendingBuildings(true);
    try {
      await Promise.all(
        selectedBuildingIds.map((buildingId) =>
          sendBuildingToChat({
            customerId: Number(matchedCustomer.customerId),
            buildingId: Number(buildingId),
            createdByStaffId: staffId,
            staffIds: [staffId],
            note: "Em g\u1eedi m\u00ecnh tham kh\u1ea3o c\u00e1c b\u1ea5t \u0111\u1ed9ng s\u1ea3n ph\u00f9 h\u1ee3p v\u1edbi nhu c\u1ea7u \u1ea1",
          }),
        ),
      );

      message.success(
        `\u0110\u00e3 g\u1eedi ${selectedBuildingIds.length} t\u00f2a nh\u00e0 cho ${matchedCustomer.fullName || "kh\u00e1ch h\u00e0ng"}`,
      );
      setSelectedBuildingIds([]);
    } catch (error) {
      console.error("Send buildings to customer error:", error);
      message.error("L\u1ed7i khi g\u1eedi t\u00f2a nh\u00e0 qua chat cho kh\u00e1ch.");
    } finally {
      setIsSendingBuildings(false);
    }
  };

  const submitStatusUpdate = async (
    payload: UpdateCustomerStatusPayload,
    targetCustomerId: number,
  ) => {
    setStatusUpdatingCustomerId(targetCustomerId);
    try {
      await updateCustomerStatus(payload);
      patchCustomerStatusInState(targetCustomerId, payload.newStatus);
      message.success("C\u1eadp nh\u1eadt tr\u1ea1ng th\u00e1i th\u00e0nh c\u00f4ng");
    } catch (error) {
      console.error("Update customer status error:", error);
      message.error("L\u1ed7i khi c\u1eadp nh\u1eadt tr\u1ea1ng th\u00e1i");
    } finally {
      setStatusUpdatingCustomerId(null);
    }
  };

  const handleStatusChange = (customer: UserDemandDTO, newStatus: string) => {
    const currentStatus = normalizeStatus(customer.status);

    if (newStatus === currentStatus) return;

    if (currentStatus === "SIGNED" && newStatus === "PAID") {
      setPaidModalCustomer(customer);
      setPaidBuildingId(null);
      setPaidTransactionType(undefined);
      setPaidContractValue(null);
      setPaidMonthlyRent(null);
      setPaidContractMonths(null);
      return;
    }

    submitStatusUpdate(
      {
        customerRequestId: Number(customer.id),
        newStatus,
      },
      Number(customer.customerId),
    );
  };

  const handlePaidStatusConfirm = async () => {
    if (!paidModalCustomer) return;

    const staffId = getCurrentStaffId();
    if (!staffId) {
      message.error(
        "Kh\u00f4ng t\u00ecm th\u1ea5y staffId. Vui l\u00f2ng \u0111\u0103ng nh\u1eadp l\u1ea1i.",
      );
      return;
    }

    if (!paidTransactionType) {
      message.error("Vui l\u00f2ng ch\u1ecdn transactionType.");
      return;
    }

    if (!paidBuildingId || paidBuildingId <= 0) {
      message.error("Vui l\u00f2ng nh\u1eadp buildingId h\u1ee3p l\u1ec7.");
      return;
    }

    const payload: UpdateCustomerStatusPayload = {
      customerRequestId: Number(paidModalCustomer.id),
      newStatus: "PAID",
      buildingId: paidBuildingId,
      staffId,
      transactionType: paidTransactionType,
    };

    if (paidTransactionType === "SALE") {
      if (!paidContractValue || paidContractValue <= 0) {
        message.error("Vui l\u00f2ng nh\u1eadp contractValue h\u1ee3p l\u1ec7.");
        return;
      }
      payload.contractValue = paidContractValue;
    }

    if (paidTransactionType === "RENT") {
      if (!paidMonthlyRent || paidMonthlyRent <= 0) {
        message.error("Vui l\u00f2ng nh\u1eadp monthlyRent h\u1ee3p l\u1ec7.");
        return;
      }
      if (!paidContractMonths || paidContractMonths <= 0) {
        message.error("Vui l\u00f2ng nh\u1eadp contractMonths h\u1ee3p l\u1ec7.");
        return;
      }
      payload.monthlyRent = paidMonthlyRent;
      payload.contractMonths = paidContractMonths;
    }

    await submitStatusUpdate(payload, Number(paidModalCustomer.customerId));
    resetPaidModalState();
  };

  const renderStatusSelect = (customer: UserDemandDTO) => {
    const normalizedStatus = normalizeStatus(customer.status);

    return (
      <Select
        disabled={statusUpdatingCustomerId === customer.customerId}
        dropdownStyle={{
          borderRadius: 10,
          boxShadow: "0 14px 32px rgba(31, 45, 61, 0.16)",
          padding: 6,
        }}
        loading={statusUpdatingCustomerId === customer.customerId}
        onChange={(value) => handleStatusChange(customer, value)}
        options={statusOptions}
        size="small"
        style={{ minWidth: 170, textAlign: "left" }}
        value={normalizedStatus}
      />
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Content style={{ padding: 28 }}>
        <Row gutter={24}>
          <Col span={13}>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                {"Ph\u00e2n c\u00f4ng kh\u00e1ch h\u00e0ng"}
              </Title>
              <Text style={{ color: MUTED }}>
                {"Ch\u00e0o m\u1eebng \u0111\u1ebfn v\u1edbi Estate Advance"}
              </Text>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Search
                allowClear
                placeholder="T\u00ecm kh\u00e1ch h\u00e0ng..."
                style={{ borderRadius: 24, width: "100%" }}
              />
            </div>

            <Spin spinning={loading}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {customers
                  .slice(
                    (selectedCustomerPage - 1) * PAGE_SIZE,
                    selectedCustomerPage * PAGE_SIZE,
                  )
                  .map((customer) => {
                    const isExpanded = expandedCustomerIds.includes(
                      String(customer.id),
                    );
                    const currentPriority =
                      customer.demand?.priorityType?.toUpperCase() || "";

                    return (
                      <Card
                        key={customer.id}
                        style={{ borderRadius: 8, border: "1px solid #f0f0f0" }}
                        type="inner"
                      >
                        <Row gutter={[12, 12]}>
                          <Col span={8}>
                            <Space size={16}>
                              <Avatar
                                size={48}
                                style={{ background: "#E6F6FF", color: "#000" }}
                              >
                                {customer.fullName?.charAt(0) || "?"}
                              </Avatar>
                              <div>
                                <Text strong style={{ display: "block" }}>
                                  {customer.fullName}
                                </Text>
                                <Text style={{ color: MUTED }}>
                                  @{customer.userName || "N/A"}
                                </Text>
                              </div>
                            </Space>
                          </Col>
                          <Col span={8}>
                            <Button
                              onClick={() =>
                                setExpandedCustomerIds((prev) =>
                                  prev.includes(String(customer.id))
                                    ? prev.filter(
                                        (id) => id !== String(customer.id),
                                      )
                                    : [...prev, String(customer.id)],
                                )
                              }
                              shape="round"
                              style={{ background: PRIMARY, width: "100%" }}
                              type="primary"
                            >
                              {"Chi ti\u1ebft nhu c\u1ea7u"}
                            </Button>
                          </Col>
                          <Col span={8} style={{ textAlign: "right" }}>
                            {renderStatusSelect(customer)}
                          </Col>
                        </Row>

                        {isExpanded ? (
                          <>
                            <Divider style={{ margin: "12px 0" }} />
                            <Card
                              style={{
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                              }}
                              type="inner"
                            >
                              <Row gutter={[12, 12]}>
                                <Col span={24}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: 8,
                                    }}
                                  >
                                    <Text type="secondary">{"M\u1ee9c gi\u00e1"}</Text>
                                    {currentPriority === "SAVINGS" ? (
                                      <Tag color="green">{"\u01afu ti\u00ean"}</Tag>
                                    ) : null}
                                    <Text strong>
                                      {formatPrice(customer.demand?.price)}
                                    </Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: 8,
                                    }}
                                  >
                                    <Text type="secondary">{"Di\u1ec7n t\u00edch"}</Text>
                                    {currentPriority === "SPACIOUS" ? (
                                      <Tag color="green">{"\u01afu ti\u00ean"}</Tag>
                                    ) : null}
                                    <Text strong style={{ color: RED_ALERT }}>
                                      {customer.demand?.area
                                        ? `${customer.demand.area} m\u00b2`
                                        : "-"}
                                    </Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: 8,
                                    }}
                                  >
                                    <Text type="secondary">{"V\u1ecb tr\u00ed"}</Text>
                                    {currentPriority === "CONVENIENT" ? (
                                      <Tag color="green">{"\u01afu ti\u00ean"}</Tag>
                                    ) : null}
                                    <Text strong>
                                      {customer.demand?.ward || "-"},{" "}
                                      {customer.demand?.province || "-"}
                                    </Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: 8,
                                    }}
                                  >
                                    <Text type="secondary">
                                      {"Lo\u1ea1i nh\u00e0 \u0111\u1ea5t"}
                                    </Text>
                                    <Text strong>
                                      {getPropertyTypeLabel(
                                        customer.demand?.propertyType,
                                      )}
                                    </Text>
                                  </div>
                                </Col>
                              </Row>
                              <div style={{ marginTop: 12 }}>
                                <Button
                                  onClick={() => handleMatching(customer)}
                                  type="dashed"
                                >
                                  {"Matching t\u00ecm t\u00f2a nh\u00e0"}
                                </Button>
                              </div>
                            </Card>
                          </>
                        ) : null}
                      </Card>
                    );
                  })}
              </Space>
            </Spin>

            <Pagination
              current={selectedCustomerPage}
              onChange={setSelectedCustomerPage}
              pageSize={PAGE_SIZE}
              style={{ textAlign: "center", marginTop: 16 }}
              total={totalCustomers}
            />
          </Col>

          <Col span={11}>
            <Card
              bodyStyle={{ flex: 1, overflowY: "auto", padding: 16 }}
              style={{
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 56px)",
              }}
              title={
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{"T\u00f2a nh\u00e0 ph\u00f9 h\u1ee3p"}</span>
                  <Button
                    disabled={selectedBuildingIds.length === 0}
                    loading={isSendingBuildings}
                    onClick={handleSendBuildingsToCustomer}
                    shape="round"
                    type="primary"
                  >
                    {"G\u1eedi kh\u00e1ch h\u00e0ng"}
                  </Button>
                </div>
              }
            >
              <Spin spinning={isMatchingLoading}>
                {matchedBuildings.length > 0 ? (
                  <Checkbox.Group
                    onChange={(vals) =>
                      setSelectedBuildingIds(vals as string[])
                    }
                    style={{ width: "100%" }}
                    value={selectedBuildingIds}
                  >
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                      {matchedBuildings.map((building) => (
                        <div
                          key={building.buildingId}
                          style={{ position: "relative" }}
                        >
                          <Checkbox
                            style={{ width: "100%" }}
                            value={String(building.buildingId)}
                          >
                            <MatchedBuildingItem building={building} />
                          </Checkbox>
                        </div>
                      ))}
                    </Space>
                  </Checkbox.Group>
                ) : (
                  <Empty
                    description="Kh\u00f4ng t\u00ecm th\u1ea5y t\u00f2a nh\u00e0 ho\u1eb7c ch\u01b0a s\u1eed d\u1ee5ng Matching"
                    style={{ marginTop: 60 }}
                  />
                )}
              </Spin>
            </Card>
          </Col>
        </Row>

        <Modal
          cancelText="H\u1ee7y"
          confirmLoading={
            paidModalCustomer
              ? statusUpdatingCustomerId === paidModalCustomer.customerId
              : false
          }
          okText="X\u00e1c nh\u1eadn"
          onCancel={resetPaidModalState}
          onOk={handlePaidStatusConfirm}
          open={Boolean(paidModalCustomer)}
          title="X\u00e1c nh\u1eadn thanh to\u00e1n"
        >
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Text type="secondary">
              {"Chuy\u1ec3n SIGNED \u2192 PAID c\u1ea7n transactionType v\u00e0 gi\u00e1 tr\u1ecb h\u1ee3p \u0111\u1ed3ng t\u01b0\u01a1ng \u1ee9ng."}
            </Text>

            <div>
              <Text strong>buildingId</Text>
              <InputNumber
                min={1}
                onChange={(value) => setPaidBuildingId(value ?? null)}
                placeholder="Nh\u1eadp ID t\u00f2a nh\u00e0"
                style={{ marginTop: 6, width: "100%" }}
                value={paidBuildingId}
              />
            </div>

            <div>
              <Text strong>transactionType</Text>
              <Select
                onChange={(value) => {
                  setPaidTransactionType(value);
                  setPaidContractValue(null);
                  setPaidMonthlyRent(null);
                  setPaidContractMonths(null);
                }}
                options={transactionTypeOptions}
                placeholder="SALE ho\u1eb7c RENT"
                style={{ marginTop: 6, width: "100%" }}
                value={paidTransactionType}
              />
            </div>

            {paidTransactionType === "SALE" ? (
              <div>
                <Text strong>contractValue</Text>
                <InputNumber
                  min={1}
                  onChange={(value) => setPaidContractValue(value ?? null)}
                  placeholder="VD: 3500000000"
                  style={{ marginTop: 6, width: "100%" }}
                  value={paidContractValue}
                />
              </div>
            ) : null}

            {paidTransactionType === "RENT" ? (
              <>
                <div>
                  <Text strong>monthlyRent</Text>
                  <InputNumber
                    min={1}
                    onChange={(value) => setPaidMonthlyRent(value ?? null)}
                    placeholder="VD: 15000000"
                    style={{ marginTop: 6, width: "100%" }}
                    value={paidMonthlyRent}
                  />
                </div>
                <div>
                  <Text strong>contractMonths</Text>
                  <InputNumber
                    min={1}
                    onChange={(value) => setPaidContractMonths(value ?? null)}
                    placeholder="VD: 24"
                    style={{ marginTop: 6, width: "100%" }}
                    value={paidContractMonths}
                  />
                </div>
              </>
            ) : null}
          </Space>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Assignment;
