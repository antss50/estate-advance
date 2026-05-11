import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Avatar,
  Tag,
  Button,
  Spin,
  Checkbox,
  message,
  Empty,
  Divider,
  Typography,
  Space,
  Pagination,
} from "antd";
import { SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type {
  UserDTO,
  AssignStaffDTO,
  DemandDTO,
  UserDemandDTO,
} from "../../types/user.type";
import { getStaffs } from "../../api/staffApi";
import assignmentApi from "../../api/assignmentApi";
import client from "../../api/axiosClient";
import { getMatchingStaffs } from "../../api/staffApi";

const { Text } = Typography;

// --- Định nghĩa các hằng số màu sắc cho UI mới ---
const RED_ALERT = "#ff4d4f";

// Status type mapping
const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "Chưa tiếp nhận", color: "#999999" },
  ASSIGNED: { label: "Đã tiếp nhận", color: "#1890ff" },
  PENDING: { label: "Chưa tiếp nhận", color: "#999999" },
  CONSULTING: { label: "Đang tư vấn", color: "#ffbb00" },
  SIGNED: { label: "Đã kí hợp đồng", color: "#faad14" },
  PAID: { label: "Đã thanh toán", color: "#52c41a" },
};

const performanceConfig: Record<string, { label: string; color: string }> = {
  EXCELLENT: { label: "Xuất sắc", color: "#ff4d4f" },
  GOOD: { label: "Tốt", color: "#52c41a" },
  AVERAGE: { label: "Trung bình", color: "#faad14" },
};

export const CustomerDemand: React.FC = () => {
  const [customers, setCustomers] = useState<UserDTO[]>([]);
  const [staffs, setStaffs] = useState<UserDTO[]>([]);
  const [assignedStaffs, setAssignedStaffs] = useState<AssignStaffDTO[]>([]);
  const [expandedDemands, setExpandedDemands] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pageSize, setPageSize] = useState(6);

  // --- Logic Fetch dữ liệu khách hàng ---
  const fetchCustomers = async (keyword: string = "", page: number = 1) => {
    setLoading(true);
    try {
      // Chỉ gọi API customer-request để lấy dữ liệu gộp
      const res = await client.get("/api/customer-request");
      const data = res?.data ?? res;

      if (Array.isArray(data)) {
        const mappedData = data.map((item: any) => ({
          ...item,
          id: String(item.customerId || item.id),
          customerRequestId: item.id,
        }));

        setCustomers(mappedData);
        setTotalCustomers(mappedData.length);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffs = async () => {
    setStaffLoading(true);
    try {
      const response = await getStaffs();
      if (Array.isArray(response)) {
        const staffsWithPerformance = response.map((staff) => ({
          ...staff,
          performance:
            Object.keys(performanceConfig)[
              Math.floor(Math.random() * Object.keys(performanceConfig).length)
            ],
          district: ["Quận 1, Quận 3", "Quận 1, Quận 4", "Quận 5, Quận 6"][
            Math.floor(Math.random() * 3)
          ],
        }));
        setStaffs(staffsWithPerformance as unknown as UserDTO[]);
      } else {
        setStaffs([]);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách nhân viên");
      console.error(error);
      setStaffs([]);
    } finally {
      setStaffLoading(false);
    }
  };

  // --- Effect xử lý khi chọn khách hàng ---
  useEffect(() => {
    if (!selectedCustomerId) return;
    const status = getCustomerStatus(selectedCustomerId);
    console.log(
      "Selected customer status:",
      status.label,
      "Status key:",
      status,
    );

    if (status.label === "Chưa tiếp nhận") {
      console.log("Status is PENDING - fetching all staffs");
      setAssignedStaffs([]);
      setStaffs([]);
      fetchStaffs();
      setSelectedStaffIds([]);
    } else {
      console.log("Status is NOT PENDING - fetching assigned staffs");
      fetchAssignedStaffs();
    }
  }, [selectedCustomerId]);

  // Hàm fetch nhân viên phụ trách
  const fetchAssignedStaffs = async () => {
    setStaffLoading(true);
    try {
      const res = await assignmentApi.getCustomerAssignments(
        Number(selectedCustomerId),
      );

      console.log("Assigned staffs response:", res);

      // Lấy mảng dữ liệu từ response
      let rawList: AssignStaffDTO[] = [];

      if (Array.isArray(res)) {
        rawList = res;
      } else if (res && Array.isArray(res as AssignStaffDTO[])) {
        rawList = res as AssignStaffDTO[];
      }

      const assignedList: AssignStaffDTO[] = rawList
        .filter((item) => item.checked === true)
        .map(
          (item) =>
            ({
              id: String(item.staffId),
              fullName: item.fullName,
            }) as unknown as AssignStaffDTO,
        );

      console.log("Filtered assigned staffs:", assignedList);

      setAssignedStaffs(assignedList);

      // keep selectedStaffIds in sync so multi-selection UI can reflect existing assignments
      const assignedIds = rawList
        .filter((item) => item.checked === true)
        .map((item) => String(item.staffId));
      setSelectedStaffIds(assignedIds);
      setStaffs([]);
    } catch (err) {
      console.error("Failed to fetch assigned staffs", err);
      message.error("Không thể tải nhân viên phụ trách");
      setAssignedStaffs([]);
      setStaffs([]);
    } finally {
      setStaffLoading(false);
    }
  };

  // --- Format tiền tệ ---
  const formatPrice = (p: number | string | undefined | null) => {
    if (p == null) return "";
    // If backend returns price as string (e.g. "1.5E7"), convert to number
    const num = typeof p === "string" ? Number(p) : p;
    if (typeof num !== "number" || Number.isNaN(num)) return String(p);
    // Assume backend already returns price in VND. Do not scale further.
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  useEffect(() => {
    fetchCustomers("", 1);
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    fetchCustomers(value, 1);
  };

  // Handle pagination change
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  // Lọc customers theo phân trang
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleAssign = async () => {
    if (!selectedCustomerId || selectedStaffIds.length === 0) {
      message.warning("Vui lòng chọn khách hàng và ít nhất một nhân viên");
      return;
    }

    setAssigningLoading(true);
    try {
      const payload = {
        customerId: Number(selectedCustomerId),
        staffIds: selectedStaffIds.map((s) => Number(s)),
      };

      await client.post("/api/customer/assignment", payload);

      message.success("Phân công thành công!");

      // Đóng panel và reset lựa chọn
      setSelectedCustomerId(null);
      setSelectedStaffIds([]);

      // Optionally refresh customers or assignments
      fetchCustomers(searchKeyword, currentPage);
    } catch (error) {
      console.error("Lỗi khi phân công:", error);
      const msg =
        (error as Error & { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Lỗi khi phân công nhân viên";
      message.error(msg);
    } finally {
      setAssigningLoading(false);
    }
  };

  const handleMatching = async (customerRequest: UserDemandDTO) => {
    const rawLocation = customerRequest.demand?.location || "";

    // Tách chuỗi bằng dấu phẩy
    const locationParts = rawLocation.split(",").map((s: string) => s.trim());

    // Lấy Ward (Phần tử đầu tiên) và chuẩn hóa
    const ward = locationParts[0] || "";

    if (!ward) {
      message.warning("Dữ liệu vị trí không hợp lệ để tìm kiếm nhân viên");
      return;
    }

    setStaffLoading(true);

    try {
      // Gọi API staff-customer-matching với Ward đã tách
      const response = await getMatchingStaffs(ward);

      const staffData = response ?? [];

      if (Array.isArray(staffData) && staffData.length > 0) {
        // Sắp xếp theo totalScore giảm dần để lấy người phù hợp nhất lên đầu
        const sortedStaff = [...staffData].sort(
          (a, b) => b.totalScore - a.totalScore,
        );

        const mappedStaffs = sortedStaff.map((s) => ({
          id: String(s.staffId),
          fullName: s.staffName,
          phone: s.phone,
          workingArea: s.workingArea,
          totalScore: s.totalScore,
          performance: s.performanceScore,
          workload: s.currentWorkload,
        }));
        console.log("Matched staffs:", mappedStaffs);
        setStaffs(mappedStaffs as unknown as UserDTO[]);
        setSelectedCustomerId(String(customerRequest.id));
        message.success(`Tìm thấy ${staffData.length} nhân viên tại ${ward}`);
      } else {
        setStaffs([]);
        message.info("Không có nhân viên phù hợp tại phường này");
      }
    } catch (error) {
      console.error("Staff matching failed:", error);
      message.error("Lỗi hệ thống khi tìm kiếm nhân viên");
    } finally {
      setStaffLoading(false);
    }
  };

  const getCustomerStatus = (customerOrId: string | UserDTO | null) => {
    if (!customerOrId) return statusConfig.PENDING;

    let statusKey: string | undefined;
    let customer: UserDTO | undefined;

    if (typeof customerOrId === "object") {
      statusKey = customerOrId.status;
      customer = customerOrId;
    } else {
      const found = customers.find(
        (c) => String(c.id) === String(customerOrId),
      );
      statusKey = found?.status;
      customer = found;
    }

    // Chuẩn hóa status key - convert to uppercase và trim
    const normalizedStatusKey = statusKey?.toUpperCase().trim() || "PENDING";

    console.log(
      "getCustomerStatus - ID:",
      customerOrId,
      "Raw StatusKey:",
      statusKey,
      "Normalized:",
      normalizedStatusKey,
      "Customer status:",
      customer?.status,
    );

    // Nếu API trả về status không có trong config, mặc định PENDING
    const result =
      statusConfig[normalizedStatusKey] ||
      statusConfig[statusKey || ""] ||
      statusConfig.PENDING;
    console.log("Mapped status result:", result);
    return result;
  };

  // --- Styles ---
  const containerStyles: React.CSSProperties = {
    padding: "24px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  };
  const customerCardStyles: React.CSSProperties = {
    background: "white",
    border: "0px solid #e0e0e0",
    borderRadius: "15px",
    marginBottom: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  };
  const headerStyles: React.CSSProperties = {
    marginBottom: "24px",
  };

  const titleStyles: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "16px",
    color: "#000000",
  };

  const searchStyles: React.CSSProperties = {
    marginBottom: "24px",
  };

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={titleStyles}>Customer's Demand Management</h1>
      </div>

      {/* Search Bar */}
      <div style={searchStyles}>
        <Input
          placeholder="Tìm kiếm khách hàng (Tên)"
          prefix={<SearchOutlined />}
          size="large"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchKeyword}
          style={{
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Spin spinning={loading}>
            {paginatedCustomers.map((customer) => {
              const status = getCustomerStatus(customer);
              const isSelected = selectedCustomerId === customer.id;

              return (
                <div
                  key={customer.id}
                  style={{
                    ...customerCardStyles,
                    backgroundColor: isSelected ? "#f0f8ff" : "white",
                    borderColor: isSelected ? "#1890ff" : "#e0e0e0",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <Row align="middle" style={{ width: "100%" }}>
                    {/* Cột 1: Thông tin khách hàng (Avatar + Name) */}
                    <Col span={10}>
                      <Row align="middle" gutter={12}>
                        <Col>
                          <Avatar
                            size={48}
                            style={{
                              background: "#E6F6FF",
                              color: "#000",
                              fontWeight: 600,
                              fontSize: "18px",
                            }}
                          >
                            {customer.fullName}
                          </Avatar>
                        </Col>
                        <Col>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "15px" }}
                          >
                            {customer.fullName}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            @{customer.userName}
                          </Text>
                        </Col>
                      </Row>
                    </Col>

                    {/* Cột 2: Nút hành động chính (Nằm ở giữa) */}
                    <Col span={8} style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        shape="round"
                        style={{
                          background: "#1677ff",
                          borderColor: "#1677ff",
                          height: "30px",
                          padding: "0 14px",
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 8px rgba(22, 119, 255, 0.15)",
                        }}
                        onMouseEnter={(e) => {
                          const btn = e.currentTarget as HTMLButtonElement;
                          btn.style.boxShadow =
                            "0 4px 12px rgba(22, 119, 255, 0.3)";
                          btn.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          const btn = e.currentTarget as HTMLButtonElement;
                          btn.style.boxShadow =
                            "0 2px 8px rgba(22, 119, 255, 0.15)";
                          btn.style.transform = "scale(1)";
                        }}
                        onClick={() =>
                          setExpandedDemands((prev) => ({
                            ...prev,
                            [customer.id]: !prev[customer.id],
                          }))
                        }
                      >
                        Chi tiết nhu cầu
                      </Button>
                    </Col>

                    {/* Cột 3: Trạng thái và Icon Menu (Nằm sát phải) */}
                    <Col span={6} style={{ textAlign: "right" }}>
                      <Space size={8} align="center">
                        <Tag
                          color={status.color}
                          style={{
                            margin: 0,
                            borderRadius: "4px",
                            padding: "2px 10px",
                            border: "none",
                            fontWeight: 500,
                          }}
                        >
                          {status.label}
                        </Tag>

                        {/* Icon menu bổ sung theo Ảnh 2 */}
                        <Button
                          type="text"
                          icon={
                            <UnorderedListOutlined
                              style={{ fontSize: "18px", color: "#8c8c8c" }}
                            />
                          }
                          onClick={() =>
                            setSelectedCustomerId(String(customer.id))
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.color = "#1677ff";
                          }}
                          onMouseLeave={(e) => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.color = "#8c8c8c";
                          }}
                        />
                      </Space>
                    </Col>
                  </Row>

                  {/* --- PANEL CHI TIẾT NHU CẦU MỚI (ĐỒNG BỘ THEO YÊU CẦU) --- */}

                  {expandedDemands[customer.id] && (
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
                              <Text strong>
                                {formatPrice(customer?.demand?.price)}
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
                              <Text strong style={{ color: RED_ALERT }}>
                                {customer?.demand?.area
                                  ? `${customer.demand.area} m²`
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
                              <Text>
                                <strong>
                                  {customer?.demand?.location || "-"}
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
                                  {(customer?.demand as DemandDTO)
                                    ?.propertyType || "Chung cư"}
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
                            onClick={() => handleMatching(customer as unknown as UserDemandDTO)}
                          >
                            Matching
                          </Button>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              );
            })}
          </Spin>

          {/* Pagination */}
          <div style={{ textAlign: "center", marginTop: 24, marginBottom: 16 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCustomers}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={[6, 10, 15, 20]}
              style={{ display: "flex", justifyContent: "center" }}
            />
          </div>
        </Col>

        {/* Panel Phân công bên phải (Giữ nguyên logic) */}
        <Col xs={24} lg={8}>
          {selectedCustomerId ? (
            <Card
              title={
                getCustomerStatus(selectedCustomerId).label === "Chưa tiếp nhận"
                  ? "Danh sách nhân viên gán"
                  : "Nhân viên phụ trách"
              }
              extra={
                getCustomerStatus(selectedCustomerId).label ===
                  "Chưa tiếp nhận" && (
                  <Button
                    type="primary"
                    onClick={handleAssign}
                    loading={assigningLoading}
                  >
                    Phân công
                  </Button>
                )
              }
            >
              <Spin spinning={staffLoading}>
                {getCustomerStatus(selectedCustomerId).label ===
                "Chưa tiếp nhận"
                  ? staffs.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <Checkbox
                          checked={selectedStaffIds.includes(String(s.id))}
                          onChange={() =>
                            setSelectedStaffIds((prev) =>
                              prev.includes(String(s.id))
                                ? prev.filter((id) => id !== String(s.id))
                                : [...prev, String(s.id)],
                            )
                          }
                        />
                        <Avatar
                          size="small"
                          src={s.avatar}
                          style={{ margin: "0 8px" }}
                        />
                        <Text>{s.fullName}</Text>
                      </div>
                    ))
                  : assignedStaffs.map((s) => (
                      <div
                        key={s.staffId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                        }}
                      >
                        <Avatar
                          size="small"
                          src={s.avatar}
                          style={{ marginRight: 8 }}
                        />
                        <Text>{s.fullName}</Text>
                      </div>
                    ))}
              </Spin>
            </Card>
          ) : (
            <Card style={{ textAlign: "center" }}>
              <Empty description="Chọn khách hàng để phân công" />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDemand;
