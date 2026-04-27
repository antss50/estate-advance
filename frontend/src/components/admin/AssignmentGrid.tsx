import { useEffect, useState } from "react";
import {
  Tabs,
  Input,
  Button,
  Space,
  Avatar,
  Tag,
  Spin,
  Empty,
  Pagination,
  Row,
  Col,
  Tooltip,
  Divider,
} from "antd";
import { SearchOutlined, PhoneOutlined } from "@ant-design/icons";
import { getCustomerRequests, getCustomerAssignment } from "../../api/userApi";
import {
  searchBuildings,
  getBuildingStaffs,
  getBuilding,
} from "../../api/buildingApi";
import { CustomerDetailModal } from "./CustomerDetailModal";
import { BuildingDetailModal } from "./BuildingDetailModal";
import type { UserDemandDTO } from "../../types/user.type";
import type {
  BuildingDTO,
  BuildingSearchResponse,
} from "../../types/building.type";
import type { BuildingStaffEntry } from "../../api/buildingApi";
import "./AssignmentGrid.css";
import type { Staff } from "../../types";

interface CustomerCardData extends UserDemandDTO {
  assignedStaffs?: Staff[];
}

interface BuildingCardData extends BuildingDTO {
  assignedStaffs?: BuildingStaffEntry[];
}

type SelectedModal =
  | null
  | { type: "customer"; id: number }
  | { type: "building"; id: number };

const STATUS_OPTIONS = ["All", "Đang tư vấn", "Đã ký hợp đồng", "Hoàn tất"];

export default function AssignmentGrid() {
  const [customerCards, setCustomerCards] = useState<CustomerCardData[]>([]);
  const [buildingCards, setBuildingCards] = useState<BuildingCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModal, setSelectedModal] = useState<SelectedModal>(null);
  const [activeTab, setActiveTab] = useState("customer");
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

//   const formatPrice = (price: number | undefined): string => {
//     if (!price) return "N/A";
//     return price >= 1_000_000
//       ? `${(price / 1_000_000).toFixed(1)}M`
//       : `${(price / 1000).toFixed(0)}K`;
//   };

  const getStatusBadgeInfo = (status: string): [string, string] => {
    const statusMap: { [key: string]: [string, string] } = {
      NEW: ["Mới", "cyan"],
      CONSULTING: ["Đang tư vấn", "blue"],
      ASSIGNED: ["Đã tiếp nhận", "yellow"],
      SIGNED: ["Đã ký hợp đồng", "green"],
      PAID: ["Hoàn tất", "green"],
    };
    return statusMap[status] || ["Không xác định", "default"];
  };

  const getCustomerInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSelectedCustomer = (): CustomerCardData | undefined => {
    if (selectedModal?.type === "customer") {
      return customerCards.find((c) => c.id === selectedModal.id);
    }
    return undefined;
  };

  const getSelectedBuilding = (): BuildingCardData | undefined => {
    if (selectedModal?.type === "building") {
      return buildingCards.find((b) => b.id === selectedModal.id);
    }
    return undefined;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const customersData = await getCustomerRequests();
        setCustomerCards(customersData || []);

        const buildingsResult = await searchBuildings({
          page: 1,
          size: 100,
        });
        const buildings = (buildingsResult as unknown as BuildingCardData[]) || [];
        setBuildingCards(buildings);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load customer requests
      const customerRequests = await getCustomerRequests();
      const customerData: CustomerCardData[] = customerRequests || [];

      // Load buildings
      const buildingsResponse = await searchBuildings({ page: 1, size: 100 });
      const buildingsList =
        (buildingsResponse as BuildingSearchResponse[]) || [];

      // Get assigned staffs for each customer
      const customersWithStaffs = await Promise.all(
        customerData.map(async (customer) => {
          try {
            const assignmentData = await getCustomerAssignment(customer.id);
            return {
              ...customer,
              assignedStaffs: assignmentData?.data || [],
            };
          } catch {
            return {
              ...customer,
              assignedStaffs: [],
            };
          }
        }),
      );

      setCustomerCards(customersWithStaffs);

      // Get building details and assigned staffs for each building
      const buildingsWithDetails = await Promise.all(
        buildingsList.map(async (building) => {
          try {
            const buildingDetail = await getBuilding(String(building.id));
            const staffsData = await getBuildingStaffs(building.id!);
            const assignedStaffs =
              staffsData?.data?.filter((s) => s.checked) || [];

            return {
              ...buildingDetail?.data,
              assignedStaffs,
            };
          } catch {
            return {
              ...building,
              assignedStaffs: [],
            };
          }
        }),
      );

      setBuildingCards(buildingsWithDetails);
    } catch (err) {
      console.error("Error loading assignment data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusClass = (status: string | undefined) => {
    if (!status) return "status-new";
    const statusMap: { [key: string]: string } = {
      NEW: "status-new",
      CONSULTING: "status-consulting",
      ASSIGNED: "status-assigned",
      SIGNED: "status-signed",
      PAID: "status-paid",
    };
    return statusMap[status.toUpperCase()] || "status-new";
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return "Mới";
    const statusMap: { [key: string]: string } = {
      NEW: "Mới",
      CONSULTING: "Tư vấn",
      ASSIGNED: "Đã phân công",
      SIGNED: "Đã ký",
      PAID: "Đã thanh toán",
    };
    return statusMap[status.toUpperCase()] || "Mới";
  };

//   const getSelectedCustomer = () => {
//     if (selectedModal?.type === "customer") {
//       return customerCards.find((c) => c.id === selectedModal.id);
//     }
//     return undefined;
//   };

//   const getSelectedBuilding = () => {
//     if (selectedModal?.type === "building") {
//       return buildingCards.find((b) => b.id === selectedModal.id);
//     }
//     return undefined;
//   };

  // Filter data based on search and status
  const filteredCustomerCards = customerCards.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phone?.includes(searchText) ||
      String(customer.id).includes(searchText);

    const matchesStatus =
      selectedStatus === "All" ||
      getStatusBadgeInfo(customer.status || "")[0] === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredBuildingCards = buildingCards.filter((building) => {
    return (
      building.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      building.address?.toLowerCase().includes(searchText.toLowerCase()) ||
      String(building.id).includes(searchText)
    );
  });

  // Pagination
  const dataToDisplay =
    activeTab === "customer" ? filteredCustomerCards : filteredBuildingCards;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = dataToDisplay.slice(startIndex, endIndex);

  // Render customer card
  const renderCustomerCard = (customer: CustomerCardData) => (
    <Col key={`customer-${customer.id}`} xs={24} sm={12} lg={8} xl={8}>
  <div
    className="assignment-card-new"
    // onClick={() => setSelectedModal({ type: "customer", id: customer.id })}
  >
    {/* --- Header Section --- */}
    <div className="card-header-new">
      <div className="card-title-section">
        <Avatar
          className="card-avatar-new"
          size={60}
          style={{ backgroundColor: "#1890ff" }}
        >
          {getCustomerInitials(customer.fullName || "")}
        </Avatar>
        <div>
          <div className="card-name">
            {customer.fullName?.toUpperCase()}
          </div>
          <div className="card-code">
            CM{String(customer.id).padStart(3, "0")}
          </div>
        </div>
      </div>
      <Tag
        color={getStatusBadgeInfo(customer.status || "")[1]}
        className="status-tag-new"
      >
        {getStatusBadgeInfo(customer.status || "")[0]}
      </Tag>
    </div>

    {/* --- Phone Section (Nằm dưới Header) --- */}
    <div className="card-phone-section">
      <PhoneOutlined className="phone-icon" />
      <span className="phone-number">{customer.phone || "Chưa cập nhật"}</span>
    </div>

    {/* --- Body Section (Nhu cầu & Nhân viên) --- */}
    <div className="card-body-new">
      <div className="demand-title">Nhu cầu</div>
      <div className="info-row">
        <span className="info-icon-label price">Giá tiền</span>
        <span className="info-value">{formatPrice(customer.demand?.price)}</span>
      </div>
      <div className="info-row">
        <span className="info-icon-label area">Diện tích</span>
        <span className="info-value">{customer.demand?.area} m²</span>
      </div>
      <div className="info-row">
        <span className="info-icon-label location">Vị trí</span>
        <span className="info-value">{customer.demand?.location}</span>
      </div>
      <div className="info-row">
        <span className="info-icon-label type">Loại</span>
        <span className="info-value">{customer.demand?.propertyType || "2PN"}</span>
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="staff-assignment-section">
        <div className="staff-label">Nhân viên phụ trách</div>
        <Avatar.Group maxCount={4} className="staff-avatars">
          {customer.assignedStaffs?.map(staff => (
            <Tooltip title={staff.fullName} key={staff.id}>
              <Avatar src={staff.avatar} />
            </Tooltip>
          ))}
        </Avatar.Group>
      </div>
    </div>
  </div>
</Col>
  );

  // Render building card
  const renderBuildingCard = (building: BuildingCardData) => (
    <Col key={`building-${building.id}`} xs={24} sm={12} lg={8} xl={8}>
      <div
        className="assignment-card-new"
        // onClick={() => setSelectedModal({ type: "building", id: building.id! })}
      >
        {building.avatar || building.image ? (
          <img
            src={building.avatar || building.image}
            alt={building.name}
            className="building-card-image"
          />
        ) : (
          <div
            className="building-card-image"
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            No Image
          </div>
        )}

        <div className="card-body-new">
          <div className="card-title-section">
            <div>
              <div className="card-code">
                BL{String(building.id).padStart(3, "0")}
              </div>
              <div className="card-name">{building.name?.toUpperCase()}</div>
            </div>
            <Button type="primary" className="action-button-new">
              Cho thuê
            </Button>
          </div>

          <div className="info-group">
            <div className="demand-tags">
              {building.rentPrice && (
                <Tag color="cyan" className="demand-tag">
                  <span className="tag-label">Giá tiền:</span>
                  <span className="tag-value">
                    {formatPrice(building.rentPrice)}
                  </span>
                </Tag>
              )}
              {building.floorArea && (
                <Tag color="cyan" className="demand-tag">
                  <span className="tag-label">Diện tích:</span>
                  <span className="tag-value">{building.floorArea} m²</span>
                </Tag>
              )}
              {building.address && (
                <Tag color="cyan" className="demand-tag">
                  <span className="tag-label">Vị trí:</span>
                  <span className="tag-value">{building.address}</span>
                </Tag>
              )}
            </div>
          </div>

          {building.assignedStaffs && building.assignedStaffs.length > 0 && (
            <div className="staff-section">
              <span className="staff-label">Nhân viên phụ trách:</span>
              <Avatar.Group maxCount={3}>
                {building.assignedStaffs.map((staff) => (
                  <Tooltip title={staff.fullName} key={staff.staffId}>
                    <Avatar>
                      {getCustomerInitials(staff.fullName || "")}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          )}
        </div>
      </div>
    </Col>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Empty description={error} />
      </div>
    );
  }

  const tabItems = [
    {
      key: "customer",
      label: "Khách hàng",
      children: (
        <>
          <div className="search-filter-section">
            <Input
              placeholder="Tìm kiếm theo tên, SĐT hoặc ID..."
              prefix={<SearchOutlined />}
              size="large"
              className="search-input-new"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Space wrap className="filter-buttons">
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  className={`filter-button ${selectedStatus === status ? "active" : ""}`}
                  onClick={() => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                >
                  {status}
                </Button>
              ))}
            </Space>
          </div>

          {paginatedData.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className="cards-grid">
                {paginatedData.map((card) => (
                    activeTab === 'customer' ? 
                    renderCustomerCard(card as CustomerCardData) 
                    : renderBuildingCard(card as BuildingCardData)
                ))}
              </Row>
              {dataToDisplay.length > pageSize && (
                <div className="pagination-section">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={dataToDisplay.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <Empty
              description="Không tìm thấy khách hàng nào"
              style={{ marginTop: "50px" }}
            />
          )}
        </>
      ),
    },
    {
      key: "building",
      label: "Tòa nhà",
      children: (
        <>
          <div className="search-filter-section">
            <Input
              placeholder="Tìm kiếm theo tên, địa chỉ hoặc ID..."
              prefix={<SearchOutlined />}
              size="large"
              className="search-input-new"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {paginatedData.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className="cards-grid">
                {paginatedData.map((card) => (
                    activeTab === 'customer' ? 
                    renderCustomerCard(card as CustomerCardData) 
                    : renderBuildingCard(card as BuildingCardData)
                ))}
              </Row>
              {dataToDisplay.length > pageSize && (
                <div className="pagination-section">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={dataToDisplay.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <Empty
              description="Không tìm thấy tòa nhà nào"
              style={{ marginTop: "50px" }}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="assignment-grid-container">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setSearchText("");
            setSelectedStatus("All");
            setCurrentPage(1);
          }}
          items={tabItems}
          className="assignment-tabs"
        />
      </div>

      {/* Modals */}
      {selectedModal?.type === "customer" && getSelectedCustomer() && (
        <CustomerDetailModal
          customer={getSelectedCustomer()!}
          assignedStaffs={
            getSelectedCustomer()?.assignedStaffs as unknown as Staff[]
          }
          onClose={() => setSelectedModal(null)}
          onAssignmentChange={() => {
            // Reload data
          }}
        />
      )}

      {selectedModal?.type === "building" && getSelectedBuilding() && (
        <BuildingDetailModal
          building={getSelectedBuilding()!}
          assignedStaffs={
            getSelectedBuilding()?.assignedStaffs as unknown as Staff[]
          }
          onClose={() => setSelectedModal(null)}
          onAssignmentChange={() => {
            // Reload data
          }}
        />
      )}
    </>
  );
}
