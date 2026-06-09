import React, { useCallback, useState, useEffect } from "react";
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
  UserDemandDTO,
  MatchedStaffForCustomerDTO,
} from "../../types/user.type";
import assignmentApi from "../../api/assignmentApi";
import client from "../../api/axiosClient";
import  { getMatchingStaffsForCustomerRequest }  from "../../api/staffApi";
import { updateCustomerStatus } from "../../api/userApi";
import Title from "antd/es/typography/Title";

const { Text } = Typography;

const RED_ALERT = "#ff4d4f";

const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "Chưa tiếp nhận", color: "#999999" },
  ASSIGNED: { label: "Đã tiếp nhận", color: "#1890ff" },
  PENDING: { label: "Chưa tiếp nhận", color: "#999999" },
  CONSULTING: { label: "Đang tư vấn", color: "#ffbb00" },
  SIGNED: { label: "Đã kí hợp đồng", color: "#faad14" },
  PAID: { label: "Đã thanh toán", color: "#52c41a" },
};

const propertyTypeConfig: Record<string, string> = {
  APARTMENT: "Căn hộ",
  RETAIL: "Mặt bằng kinh doanh",
  WAREHOUSE: "Kho bãi",
  OFFICE: "Văn phòng",
};

const looksLikeProvince = (value?: string) => {
  const normalized = value?.toLowerCase().trim() || "";
  return (
    normalized.includes("tỉnh") ||
    normalized.includes("thành phố") ||
    normalized.includes("tp.") ||
    normalized.includes("hà nội") ||
    normalized.includes("hồ chí minh") ||
    normalized.includes("đà nẵng")
  );
};

const getDemandLocation = (demand?: UserDemandDTO["demand"]) => {
  const ward = demand?.ward || "";
  const province = demand?.province || "";

  if (looksLikeProvince(ward) && province) {
    return {
      ward: province,
      province: ward,
    };
  }

  return { ward, province };
};

export const CustomerDemand: React.FC = () => {
  const [customers, setCustomers] = useState<UserDemandDTO[]>([]); 
  const [staffs, setStaffs] = useState<MatchedStaffForCustomerDTO[]>([]); 
  const [assignedStaffs, setAssignedStaffs] = useState<Record<number, AssignStaffDTO[]>>({}); 

  const [expandedDemands, setExpandedDemands] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pageSize, setPageSize] = useState(6);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await client.get("/api/customer-request");
      const data = Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [];
      const newDemands = (data as UserDemandDTO[]).filter(
        (item) => item.status?.toUpperCase().trim() === "NEW",
      );
      setCustomers(newDemands);
      setTotalCustomers(newDemands.length);
    } catch (error) {
      message.error("Lỗi khi tải danh sách nhu cầu khách hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CẢI TIẾN: Truyền trực tiếp targetId vào hàm để tránh phụ thuộc state bất đồng bộ
  const fetchAssignedStaffs = useCallback(async (targetId: number) => {
    if (targetId === null) return;
    setStaffLoading(true);
    try {
      const currentRequest = customers.find(c => c.id === targetId || c.customerId === targetId);
      const realCustomerId = currentRequest ? currentRequest.customerId : targetId;

      if (!realCustomerId) {
        console.warn("Không tìm thấy Customer ID hợp lệ để gọi API assignment");
        setAssignedStaffs(prev => ({ ...prev, [targetId]: [] }));
        return;
      }

      console.log("Đang gọi API lấy nhân viên phụ trách cho Customer ID:", realCustomerId);
      const res = await assignmentApi.getCustomerAssignments(Number(realCustomerId));
      console.log("Assigned staffs response từ API:", res);

      let rawList: AssignStaffDTO[] = [];
      if (Array.isArray(res)) {
        rawList = res;
      } else if (res && typeof res === "object" && "data" in res && Array.isArray((res as { data: unknown }).data)) {
        rawList = (res as { data: AssignStaffDTO[] }).data;
      }

      const assignedList: AssignStaffDTO[] = rawList
        .filter((item) => item.checked === true)
        .map((item) => ({
          ...item,
          staffId: item.staffId,
          fullName: item.fullName,
        }));

      // Lưu trữ chính xác dữ liệu dựa trên ID yêu cầu đang thao tác hiển thị
      setAssignedStaffs(prev => ({ ...prev, [targetId]: assignedList }));

      const assignedIds = rawList
        .filter((item) => item.checked === true)
        .map((item) => String(item.staffId));
      setSelectedStaffIds(assignedIds);
      setStaffs([]);
    } catch (err) {
      console.error("Failed to fetch assigned staffs error:", err);
      message.error("Không thể tải danh sách nhân viên phụ trách");
    } finally {
      setStaffLoading(false);
    }
  }, [customers]);

  // Tự động chạy tải lại nếu có thay đổi ID (và không ở chế độ Matching)
  useEffect(() => {
    if (selectedCustomerId && !isMatching) {
      fetchAssignedStaffs(selectedCustomerId);
    }
  }, [fetchAssignedStaffs, isMatching, selectedCustomerId]);

  const formatPrice = (p: number | string | undefined | null) => {
    if (p == null) return "";
    const num = typeof p === "string" ? Number(p) : p;
    if (typeof num !== "number" || Number.isNaN(num)) return String(p);
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    fetchCustomers();
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAssign = async () => {
    if (!selectedCustomerId || selectedStaffIds.length === 0) {
      message.warning("Vui lòng chọn khách hàng và ít nhất một nhân viên");
      return;
    }

    setAssigningLoading(true);
    try {
      const currentRequest = customers.find(c => c.id === selectedCustomerId);
      if (!currentRequest) {
        message.error("KhÃ´ng tÃ¬m tháº¥y yÃªu cáº§u khÃ¡ch hÃ ng Ä‘ang chá»n");
        return;
      }

      const payload = {
        customerId: Number(currentRequest.customerId),
        demandId: Number(currentRequest.demand?.id),
        staffIds: selectedStaffIds.map((s) => Number(s)),
      };

      await assignmentApi.assignStaffToCustomer(payload);
      await updateCustomerStatus({
        customerRequestId: Number(currentRequest.id),
        customerId: Number(currentRequest.customerId),
        demandId: Number(currentRequest.demand?.id),
        newStatus: "ASSIGNED",
        staffId: Number(selectedStaffIds[0]),
      });
      message.success("Phân công thành công!");

      setSelectedCustomerId(null);
      setSelectedStaffIds([]);
      fetchCustomers();
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
    setIsMatching(true);
    setStaffLoading(true);
    setSelectedCustomerId(customerRequest.id);

    try {
      const currentDemand = customers.find(c => String(c.id) === String(customerRequest.id))?.demand ?? customerRequest.demand;
      const location = getDemandLocation(currentDemand);
      const response = await getMatchingStaffsForCustomerRequest({
        customerId: customerRequest.customerId,
        demandWard: location.ward,
      });

      const staffData = response.results ?? [];

      if (Array.isArray(staffData) && staffData.length > 0) {
        const sortedStaff = [...staffData].sort(
          (a, b) => b.totalScoreCS - a.totalScoreCS,
        );

        const mappedStaffs = sortedStaff.map((s) => ({
          ...s,
          staffId: Number(s.staffId),
          staffName: s.staffName,
          totalScore: s.totalScoreCS,
        }));
        setStaffs(mappedStaffs);
        message.success(`Tìm thấy ${staffData.length} nhân viên tại ${location.ward}`);
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

  const getCustomerStatus = (customerOrId: number | UserDTO | null) => {
    if (!customerOrId) return statusConfig.PENDING;

    let statusKey: string | undefined;
    if (typeof customerOrId === "object") {
      statusKey = customerOrId.status;
    } else {
      const found = customers.find((c) => String(c.id) === String(customerOrId));
      statusKey = found?.status;
    }

    const normalizedStatusKey = statusKey?.toUpperCase().trim() || "PENDING";
    return statusConfig[normalizedStatusKey] || statusConfig[statusKey || ""] || statusConfig.PENDING;
  };

  const getPropertyTypeLabel = (propertyType: string | undefined) => {
    return propertyTypeConfig[propertyType || ""] || propertyType || "Không xác định";
  };

  const customerCardStyles: React.CSSProperties = {
    background: "white",
    borderRadius: "15px",
    marginBottom: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  };

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý Nhu Cầu Khách Hàng
          </Title>
          <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
            Chào mừng đến với Estate Advance
          </span>
        </Col>

        <Col>
          <Space>
            <Input
              placeholder="Tìm kiếm Khách hàng (theo tên)"
              prefix={<SearchOutlined />}
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchKeyword}
              style={{ borderRadius: "30px", width: 520, fontSize: "12.5px" }}
            />
            <Button type="primary" shape="circle">
              <SearchOutlined />
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Spin spinning={loading}>
            {paginatedCustomers.map((customer) => {
              const status = getCustomerStatus(customer);
              const isSelected = selectedCustomerId === customer.id;
              const currentPriority = customer?.demand?.priorityType?.toUpperCase() || "";
              return (
                <div
                  key={customer.id}
                  style={{
                    ...customerCardStyles,
                    backgroundColor: isSelected ? "#f0f8ff" : "white",
                    border: isSelected ? "1px solid #1890ff" : "0px solid #e0e0e0",
                  }}
                >
                  <Row align="middle" style={{ width: "100%" }}>
                    <Col span={10}>
                      <Row align="middle" gutter={12}>
                        <Col>
                          <Avatar
                            size={48}
                            style={{ background: "#E6F6FF", color: "#000", fontWeight: 600, fontSize: "18px" }}
                          >
                            {customer.fullName ? customer.fullName.charAt(0) : "U"}
                          </Avatar>
                        </Col>
                        <Col>
                          <Text strong style={{ display: "block", fontSize: "15px" }}>
                            {customer.fullName}
                          </Text>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={8} style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        shape="round"
                        style={{ background: "#1677ff", borderColor: "#1677ff", height: "30px", padding: "0 14px", fontWeight: 500 }}
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

                    <Col span={6} style={{ textAlign: "right" }}>
                      <Space size={8} align="center">
                        <Tag color={status.color} style={{ margin: 0, borderRadius: "4px", padding: "2px 10px", border: "none", fontWeight: 500 }}>
                          {status.label}
                        </Tag>

                        {/* ✅ SỬA LOGIC CLICK: Chủ động ép tắt isMatching và gọi fetch mới */}
                        <Button
                          type="text"
                          icon={<UnorderedListOutlined style={{ fontSize: "18px", color: isSelected && !isMatching ? "#1890ff" : "#8c8c8c" }} />}
                          onClick={() => {
                            setIsMatching(false);
                            setSelectedCustomerId(customer.id);
                            fetchAssignedStaffs(customer.id); 
                          }}
                        />
                      </Space>
                    </Col>
                  </Row>

                  {/* Panel chi tiết nhu cầu */}
                  {expandedDemands[customer.id] && (
                    <>
                      <Divider style={{ margin: "12px 0" }} />
                      <Card type="inner" style={{ borderRadius: 8, border: "1px solid #f0f0f0" }}>
                        <Row gutter={[12, 12]}>
                          <Col span={24}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <Text type="secondary">Mức giá</Text>
                              {currentPriority === "SAVINGS" && <Tag color="green">Ưu tiên</Tag>}
                              <Text strong>{formatPrice(customer?.demand?.price)}</Text>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <Text type="secondary">Diện tích</Text>
                              {currentPriority === "SPACIOUS" && <Tag color="green">Ưu tiên</Tag>}
                              <Text strong style={{ color: RED_ALERT }}>{customer?.demand?.area ? `${customer.demand.area} m²` : "-"}</Text>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <Text type="secondary">Vị trí</Text>
                              {currentPriority === "CONVENIENT" && <Tag color="green">Ưu tiên</Tag>}
                              <Text strong>
                                {getDemandLocation(customer?.demand).ward || "-"}, {getDemandLocation(customer?.demand).province || "-"}
                              </Text>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <Text type="secondary">Loại nhà đất</Text>
                              <Text strong>{getPropertyTypeLabel(customer?.demand?.propertyType)}</Text>
                            </div>
                          </Col>
                        </Row>
                        <div style={{ marginTop: 12 }}>
                          <Button type="dashed" onClick={() => handleMatching(customer)}>
                            Matching tìm nhân viên
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

        {/* Right Sidebar Component: Panel hiển thị danh sách nhân viên */}
        <Col xs={24} lg={8}>
          {selectedCustomerId ? (
            <Card
              title={isMatching ? "Danh sách nhân viên gán" : "Nhân viên phụ trách"}
              extra={
                isMatching && (
                  <Button type="primary" onClick={handleAssign} loading={assigningLoading}>
                    Phân công
                  </Button>
                )
              }
            >
              <Spin spinning={staffLoading}>
                {isMatching ? (
                  staffs.map((s) => (
                    <div key={s.staffId} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <Checkbox
                        checked={selectedStaffIds.includes(String(s.staffId))}
                        onChange={() =>
                          setSelectedStaffIds((prev) =>
                            prev.includes(String(s.staffId))
                              ? prev.filter((id) => id !== String(s.staffId))
                              : [...prev, String(s.staffId)]
                          )
                        }
                      />
                      <Avatar size="small" style={{ margin: "0 8px" }} />
                      <Text>{s.staffName || s.staffName}</Text>
                      <div style={{ textAlign: "right", marginLeft: "auto" }}>
                        <Tag color={(s.totalScoreCS || 0) >= 0.8 ? "green" : "orange"}>
                          {typeof s.totalScoreCS === 'number' ? `${Math.round(s.totalScoreCS * 100)}% Match` : "0% Match"}
                        </Tag>
                      </div>
                    </div>
                  ))
                ) : (
                  (() => {
                    const activeStaffs = assignedStaffs[selectedCustomerId] || [];
                    if (activeStaffs.length > 0) {
                      return activeStaffs.map((s) => (
                        <div key={s.staffId} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                          <Avatar size="small" style={{ marginRight: 8 }} />
                          <Text>{s.fullName}</Text>
                        </div>
                      ));
                    }
                    return (
                      <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '12px 0' }}>
                        Chưa có nhân viên phụ trách cụ thể cho yêu cầu này
                      </Text>
                    );
                  })()
                )}
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
