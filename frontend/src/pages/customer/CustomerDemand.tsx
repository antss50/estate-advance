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
  Pagination,
  Checkbox,
  message,
  Empty,
} from "antd";
import { SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type { UserDTO } from "../../types/user.type";
import type { AssignStaffDTO } from "../../types/user.type";
import { getStaffs } from "../../api/staffApi";
import assignmentApi from "../../api/assignmentApi";
import client from "../../api/axiosClient";

// Status type mapping
const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chưa tiếp nhận", color: "#999999" },
  CONSULTING: { label: "Đang tư vấn", color: "#1890ff" },
  SIGNED: { label: "Đã kí hợp đồng", color: "#faad14" },
  PAID: { label: "Đã thanh toán", color: "#52c41a" },
};

// Performance type mapping
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
  const [pageSize, setPageSize] = useState(10);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  // const [demandData, setDemandData] = useState<Record<string, DemandData>>({});
  const [assigningLoading, setAssigningLoading] = useState(false);

  // Fetch customers data from real API
  const fetchCustomers = async (keyword: string = "", page: number = 1) => {
    setLoading(true);
    try {
      // Fetch both customer demands and customers in parallel
      const [resDemand, resCustomer] = await Promise.all([
        client.get("/api/customer-request"),
        client.get("/api/customer"),
      ]);

      const demandPayload = resDemand?.data ?? resDemand;
      const customerPayload = resCustomer?.data ?? resCustomer;

      const demands = Array.isArray(demandPayload)
        ? demandPayload
        : Array.isArray((demandPayload as any)?.data)
          ? (demandPayload as any).data
          : [];

      const customersList = Array.isArray(customerPayload)
        ? customerPayload
        : Array.isArray((customerPayload as any)?.data)
          ? (customerPayload as any).data
          : [];

      // Merge demands into customers by id. If a demand exists without a matching customer, include it.
      const map = new Map<string, any>();
      customersList.forEach((c: any) => map.set(String(c.id), { ...c }));

      (demands as any[]).forEach((d) => {
        const id = String(d.id ?? d.customerId ?? "");
        if (!id) return;
        if (map.has(id)) {
          const existing = map.get(id);
          existing.demand = d.demand ?? d.demand ?? existing.demand;
          existing.status = d.status ?? existing.status;
          map.set(id, existing);
        } else {
          // demand-only entry: ensure it has id and demand/status
          const entry = {
            id: id,
            fullName: d.fullName ?? "",
            demand: d.demand ?? d,
            status: d.status,
          };
          map.set(id, entry);
        }
      });

      const combined = Array.from(map.values());
      setCustomers(combined as UserDTO[]);
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      console.error(error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staffs data
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

  // Load staffs when right panel opens
  useEffect(() => {
    if (!selectedCustomerId) return;
    const status = getCustomerStatus(selectedCustomerId);
    console.log("Selected customer ID:", selectedCustomerId, "Status:", status);
    if (status.label === "Chưa tiếp nhận") {
      // for new customers, show full staff list and allow assignment
      setAssignedStaffs([]);
      fetchStaffs();
      setSelectedStaffIds([]);
    } else {
      // for customers already in flow, load only assigned staffs (read-only)
      const fetchAssignedStaffs = async (customerId: string) => {
        setStaffLoading(true);
        try {
          const res = await assignmentApi.getCustomerAssignments(
            Number(customerId),
          );

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
        } finally {
          setStaffLoading(false);
        }
      };

      fetchAssignedStaffs(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  // Helper: format price (price may be number in millions or a string)
  const formatPrice = (p: number | string | undefined | null) => {
    if (p == null) return "";
    // If backend returns price as string (e.g. "1.5E7"), convert to number
    const num = typeof p === "string" ? Number(p) : p;
    if (typeof num !== "number" || Number.isNaN(num)) return String(p);
    // Assume backend already returns price in VND. Do not scale further.
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  // Initial data load
  useEffect(() => {
    fetchCustomers("", 1);
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    fetchCustomers(value, 1);
  };

  // Handle pagination change
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
    fetchCustomers(searchKeyword, page);
  };

  // Handle assignment
  // Handle assignment (API Thật)
  const handleAssign = async () => {
    if (!selectedCustomerId || selectedStaffIds.length === 0) {
      message.warning("Vui lòng chọn khách hàng và ít nhất một nhân viên");
      return;
    }

    setAssigningLoading(true);
    try {
      // 1. Tạo payload khớp chuẩn 100% với AssignmentCustomerDTO của Java
      const payload = {
        customerId: Number(selectedCustomerId),
        staffIds: selectedStaffIds.map((s) => Number(s)),
      };

      // 2. Gọi API POST
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
        (error as any)?.response?.data?.message ||
        "Lỗi khi phân công nhân viên";
      message.error(msg);
    } finally {
      setAssigningLoading(false);
    }
  };

  // Get status for a customer. Prefer `customer.status` from API; fallback to hashed mock.
  const getCustomerStatus = (customerOrId: string | UserDTO | null) => {
    if (!customerOrId) return statusConfig.PENDING;

    let statusKey: string | undefined;

    if (typeof customerOrId === "object") {
      statusKey = customerOrId.status;
    } else {
      const found = customers.find(
        (c) => String(c.id) === String(customerOrId),
      );
      statusKey = found?.status;
    }

    // Nếu API trả về "NEW", map nó vào PENDING hoặc bổ sung NEW vào statusConfig
    return statusConfig[statusKey || "PENDING"] || statusConfig.PENDING;
  };

  const containerStyles: React.CSSProperties = {
    padding: "24px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
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

  const customerCardStyles: React.CSSProperties = {
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    marginBottom: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const customerHeaderStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  };

  const customerInfoStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: "12px",
  };

  const customerNameStyles: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#000000",
  };

  const customerUsernameStyles: React.CSSProperties = {
    fontSize: "12px",
    color: "#999999",
    marginTop: "4px",
  };

  const actionButtonsStyles: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  const demandExpanderStyles: React.CSSProperties = {
    marginTop: "12px",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "12px",
  };

  const demandRowStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "8px",
    alignItems: "center",
  };

  const demandLabelStyles: React.CSSProperties = {
    color: "#666666",
    fontWeight: 500,
  };

  const rightPanelStyles: React.CSSProperties = {
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  };

  const staffItemStyles: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const staffNameStyles: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#000000",
  };

  const staffDistrictStyles: React.CSSProperties = {
    fontSize: "12px",
    color: "#999999",
    marginTop: "2px",
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

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Left Panel - Customer List */}
        <Col xs={24} lg={16}>
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div
              style={{
                background: "white",
                borderRadius: "8px",
                padding: "0px",
              }}
            >
              {customers.length === 0 ? (
                <Empty
                  description="Không tìm thấy khách hàng"
                  style={{ padding: "24px" }}
                />
              ) : (
                <div>
                  {customers.map((customer) => {
                    const status = getCustomerStatus(customer.id);
                    // const demand = demandData[customer.id];

                    return (
                      <div
                        key={customer.id}
                        style={{
                          ...customerCardStyles,
                          backgroundColor:
                            selectedCustomerId === customer.id
                              ? "#f0f8ff"
                              : "white",
                          borderColor:
                            selectedCustomerId === customer.id
                              ? "#1890ff"
                              : "#e0e0e0",
                        }}
                      >
                        {/* Customer Header */}
                        <div style={customerHeaderStyles}>
                          <div style={customerInfoStyles}>
                            <Avatar size={40} src={customer.avatarUrl} />
                            <div>
                              <div style={customerNameStyles}>
                                {customer.fullName}
                              </div>
                              <div style={customerUsernameStyles}>
                                #{customer.userName}
                              </div>
                            </div>
                          </div>
                          <div style={actionButtonsStyles}>
                            <Tag
                              color={status.color}
                              style={{
                                border: "none",
                                fontSize: "11px",
                                padding: "4px 8px",
                              }}
                            >
                              {status.label}
                            </Tag>
                            <Button
                              type="text"
                              icon={<UnorderedListOutlined />}
                              onClick={() => setSelectedCustomerId(customer.id)}
                              title="Chọn khách hàng"
                            />
                          </div>
                        </div>

                        {/* Demand Details (now using customer.demand and toggle) */}
                        <div style={demandExpanderStyles}>
                          <Button
                            size="small"
                            onClick={() => {
                              const cid = customer.id;
                              setExpandedDemands((s) => ({
                                ...s,
                                [cid]: !s[cid],
                              }));
                            }}
                          >
                            Chi tiết nhu cầu
                          </Button>

                          {expandedDemands[customer.id] && (
                            <div style={{ marginTop: 12 }}>
                              <div style={demandRowStyles}>
                                <span style={demandLabelStyles}>Mức giá:</span>
                                <span>
                                  {formatPrice(customer?.demand?.price)}
                                </span>
                              </div>
                              <div style={demandRowStyles}>
                                <span style={demandLabelStyles}>
                                  Diện tích:
                                </span>
                                <span>{customer?.demand?.area ?? "-"} m²</span>
                              </div>
                              <div style={demandRowStyles}>
                                <span style={demandLabelStyles}>Vị trí:</span>
                                <span>{customer?.demand?.location ?? "-"}</span>
                              </div>
                              <Button
                                type="primary"
                                size="small"
                                style={{ marginTop: 12 }}
                              >
                                Matching
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={customers.length * 10} // Mock total for demonstration
                      onChange={handlePageChange}
                      showSizeChanger
                      pageSizeOptions={[10, 20, 50]}
                      locale={{ items_per_page: "/ trang" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Spin>
        </Col>

        {/* Right Panel - Staff Assignment */}
        <Col xs={24} lg={8}>
          {selectedCustomerId ? (
            <Spin spinning={staffLoading || assigningLoading}>
              <div style={rightPanelStyles}>
                {(() => {
                  const status = getCustomerStatus(selectedCustomerId);
                  const isPending = status?.label === "Chưa tiếp nhận";
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {isPending
                            ? "Danh sách nhân viên"
                            : "Nhân viên phụ trách"}
                        </h3>
                        {isPending && (
                          <Button
                            type="primary"
                            onClick={handleAssign}
                            disabled={selectedStaffIds.length === 0}
                          >
                            Phân công
                          </Button>
                        )}
                      </div>

                      {isPending ? (
                        // Checkbox selection for multi-assignment
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {staffs.length === 0 ? (
                            <Empty
                              description="Không có nhân viên"
                              style={{ padding: "24px" }}
                            />
                          ) : (
                            staffs.map((staff: UserDTO) => {
                              const checked = selectedStaffIds.includes(
                                String(staff.id),
                              );
                              return (
                                <div
                                  key={staff.id}
                                  style={{ width: "100%", marginBottom: 0 }}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onChange={() => {
                                      setSelectedStaffIds((prev) => {
                                        const idStr = String(staff.id);
                                        if (prev.includes(idStr))
                                          return prev.filter(
                                            (x) => x !== idStr,
                                          );
                                        return [...prev, idStr];
                                      });
                                    }}
                                    style={{ width: "100%" }}
                                  >
                                    <div style={staffItemStyles}>
                                      <Avatar
                                        size={32}
                                        src={staff.avatarUrl}
                                        style={{ marginRight: "8px" }}
                                      />
                                      <div style={{ flex: 1 }}>
                                        <div style={staffNameStyles}>
                                          {staff.fullName}
                                        </div>
                                        <div style={staffDistrictStyles}></div>
                                      </div>
                                    </div>
                                  </Checkbox>
                                </div>
                              );
                            })
                          )}
                        </div>
                      ) : (
                        // Read-only assigned staff list
                        <div>
                          {assignedStaffs.length === 0 ? (
                            <Empty description="Chưa có nhân viên phụ trách" />
                          ) : (
                            assignedStaffs.map((s) => (
                              <div key={s.id} style={staffItemStyles}>
                                <Avatar
                                  size={32}
                                  src={s.avatarUrl}
                                  style={{ marginRight: 8 }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={staffNameStyles}>
                                    {s.fullName}
                                  </div>
                                  <div style={staffDistrictStyles}>
                                    {/* keep style consistency */}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </Spin>
          ) : (
            <Card
              style={{
                textAlign: "center",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Empty
                description="Chọn một khách hàng để xem danh sách nhân viên"
                style={{ marginTop: "40px", marginBottom: "40px" }}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDemand;
