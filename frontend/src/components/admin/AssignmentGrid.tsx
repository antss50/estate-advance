import { useCallback, useEffect, useState } from "react";
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
import { searchBuildings, getBuildingStaffs, getBuilding } from "../../api/buildingApi";
import { CustomerDetailModal } from "./CustomerDetailModal";
import type { AssignStaffDTO, UserDemandDTO } from "../../types/user.type";
import type { BuildingDTO} from "../../types/building.type";
// import type { BuildingStaffEntry } from "../../types/building.type";
import "./AssignmentGrid.css";
import type { Staff } from "../../types";

interface CustomerCardData extends UserDemandDTO {
  assignedStaffs?: Staff[];
}

interface BuildingCardData extends BuildingDTO {
  assignedStaffs?: AssignStaffDTO[];
}

type SelectedModal =
  | null
  | { type: "customer"; id: number }
  | { type: "building"; id: number };

const STATUS_OPTIONS = ["All", "Đang tư vấn", "Đã ký hợp đồng", "Hoàn tất"];

const propertyTypeConfig: Record<string, string> = {
  APARTMENT: "Căn hộ",
  RETAIL: "Mặt bằng kinh doanh",
  WAREHOUSE: "Kho bãi",
  OFFICE: "Văn phòng",
}

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
  const [totalPages, setTotalPages] = useState(1);

  const getStatusBadgeInfo = (status: string): [string, string] => {
    const statusMap: { [key: string]: [string, string] } = {
      NEW: ["", "cyan"],
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

  const getStaffInitials = (fullName: string): string => {
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

  const getPropertyTypeLabel = (propertyType: string | undefined) => {
    return propertyTypeConfig[propertyType || ""] || propertyType || "Không xác định";
  };

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const response = await getCustomerRequests();
  //   const customerList = Array.isArray(response) ? response : [];

  //   // 2. Duyệt qua từng request để gọi API lấy nhân viên phụ trách tương ứng
  //   const enrichedCustomers = await Promise.all(
  //     customerList.map(async (customer) => {
  //       // Kiểm tra customerId thực tế của bản ghi request
  //       const cId = customer.customerId || customer.id;
        
  //       if (!cId) {
  //         return { ...customer, assignedStaffs: [] };
  //       }

  //       try {
  //         // Gọi API lấy thông tin phân công nhân viên cho từng khách hàng
  //         const assignmentRes = await getCustomerAssignment(Number(cId));
          
  //         let rawStaffs: Staff[] = [];
  //         if (Array.isArray(assignmentRes)) {
  //           rawStaffs = assignmentRes;
  //         } else if (assignmentRes && typeof assignmentRes === "object" && "data" in assignmentRes) {
  //           rawStaffs = (assignmentRes as { data: Staff[] }).data || [];
  //         }

  //         // Lọc ra những nhân viên đang phụ trách thực tế (có checked === true)
  //         const assignedStaffs = rawStaffs.filter((s) => s.checked === true);

  //         // Trả về object customer đã được đính kèm danh sách nhân viên phụ trách
  //         return {
  //           ...customer,
  //           assignedStaffs,
  //         };
  //       } catch (error) {
  //         console.error(`Lỗi khi lấy nhân viên của customer id ${cId}:`, error);
  //         return { ...customer, assignedStaffs: [] }; // Trả về mảng rỗng nếu API lỗi đơn lẻ
  //       }
  //     })
  //   );

  //   // 3. Cập nhật dữ liệu đã được làm giàu thông tin vào State
  //   setCustomerCards(enrichedCustomers);
  //   setTotalPages(Math.ceil(enrichedCustomers.length / pageSize));
  //   console.log("Dữ liệu Customers sau khi gộp Staff phụ trách:", enrichedCustomers);
  // } catch (error) {
  //   console.error("Lỗi khi tải danh sách phân công khách hàng:", error);
  // } finally {
  //   setLoading(false);
  // }

  //   loadData();
  // }, []);

  const loadData = useCallback (async () => {
  setLoading(true);
  try {
    // 1. Lấy danh sách customer requests từ API gốc
    const response = await getCustomerRequests();
    const customerList = Array.isArray(response) ? response : [];

    const buildingsResponse = await searchBuildings({ page: 1, size: 100 });
      let buildingsList: BuildingCardData[] = [];
      if (Array.isArray(buildingsResponse)) {
        buildingsList = buildingsResponse;
      } else if (buildingsResponse && typeof buildingsResponse === "object") {
        buildingsList = (buildingsResponse as { data: BuildingCardData[] }).data || (buildingsResponse as { listResult: BuildingCardData[] }).listResult || [];
      }

    // 2. Duyệt qua từng request để gọi API lấy nhân viên phụ trách tương ứng
    const enrichedCustomers = await Promise.all(
      customerList.map(async (customer) => {
        // Kiểm tra customerId thực tế của bản ghi request
        const cId = customer.customerId || customer.id;
        
        if (!cId) {
          return { ...customer, assignedStaffs: [] };
        }

        try {
          // Gọi API lấy thông tin phân công nhân viên cho từng khách hàng
          const assignmentRes = await getCustomerAssignment(Number(cId));
          
          let rawStaffs: Staff[] = [];
          if (Array.isArray(assignmentRes)) {
            rawStaffs = assignmentRes;
          } else if (assignmentRes && typeof assignmentRes === "object" && "data" in assignmentRes) {
            rawStaffs = (assignmentRes as { data: Staff[] }).data || [];
          }

          // Lọc ra những nhân viên đang phụ trách thực tế (có checked === true)
          const assignedStaffs = rawStaffs.filter((s) => s.checked === true);

          // Trả về object customer đã được đính kèm danh sách nhân viên phụ trách
          return {
            ...customer,
            assignedStaffs,
          };
        } catch (error) {
          console.error(`Lỗi khi lấy nhân viên của customer id ${cId}:`, error);
          return { ...customer, assignedStaffs: [] }; // Trả về mảng rỗng nếu API lỗi đơn lẻ
        }
      })
    );

    const buildingsWithDetails = await Promise.all(
        buildingsList.map(async (building) => {
          try {
            const buildingId = building.id;
            if (!buildingId) return building;

            const buildingDetail = await getBuilding(String(buildingId));
            const staffsData = await getBuildingStaffs(buildingId);
            
            const staffList = Array.isArray(staffsData) 
              ? staffsData 
              : (staffsData as { data: AssignStaffDTO[] })?.data  || [];

            const assignedStaffs = staffList
        .filter((s: AssignStaffDTO) => s.checked === "checked")
            return {
              ...building,
              ...(buildingDetail?.data || buildingDetail),
              assignedStaffs,
            };
          } catch (error) {
            console.error("Lỗi khi tải chi tiết tòa nhà ID:", building.id, error);
            return { ...building, assignedStaffs: [] };
          }
        })
      );
      setBuildingCards(buildingsWithDetails);

    // 3. Cập nhật dữ liệu đã được làm giàu thông tin vào State
    setCustomerCards(enrichedCustomers);
    setTotalPages(Math.ceil(enrichedCustomers.length / pageSize));
    console.log("Dữ liệu Customers sau khi gộp Staff phụ trách:", enrichedCustomers);
  } catch (error) {
    console.error("Lỗi khi tải danh sách phân công khách hàng:", error);
  } finally {
    setLoading(false);
  }
}, [pageSize]);

useEffect(() => {
    loadData();
}, [loadData]);

  const formatPrice = (price: number | undefined) => {
     if (price == null) return "";
    // If backend returns price as string (e.g. "1.5E7"), convert to number
    const num = typeof price === "string" ? Number(price) : price;
    if (typeof num !== "number" || Number.isNaN(num)) return String(price);
    // Assume backend already returns price in VND. Do not scale further.
    return new Intl.NumberFormat("vi-VN").format(num) + " VNĐ";
  };

  // const getStatusClass = (status: string | undefined) => {
  //   if (!status) return "status-new";
  //   const statusMap: { [key: string]: string } = {
  //     NEW: "status-new",
  //     CONSULTING: "status-consulting",
  //     ASSIGNED: "status-assigned",
  //     SIGNED: "status-signed",
  //     PAID: "status-paid",
  //   };
  //   return statusMap[status.toUpperCase()] || "status-new";
  // };

  // const getStatusLabel = (status: string | undefined) => {
  //   if (!status) return "";
  //   const statusMap: { [key: string]: string } = {
  //     NEW: "Mới",
  //     CONSULTING: "Tư vấn",
  //     ASSIGNED: "Đã phân công",
  //     SIGNED: "Đã ký",
  //     PAID: "Đã thanh toán",
  //   };
  //   return statusMap[status.toUpperCase()] || "";
  // };

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
        {getStatusBadgeInfo(customer.status || "Đang tư vấn")[0]}
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
        <span className="info-value" style={{textAlign: "right"}}>{customer.demand?.ward}, {customer.demand?.province}</span>
      </div>
      <div className="info-row">
        <span className="info-icon-label type">Loại</span>
        <span className="info-value">{getPropertyTypeLabel(customer.demand?.propertyType)}</span>
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="staff-assignment-section">
        <div className="staff-label">Nhân viên phụ trách</div>
        <Avatar.Group maxCount={4} className="staff-avatars">
          {customer.assignedStaffs?.map(staff => (
            <Tooltip title={staff.fullName} key={staff.id}>
              <Avatar src={staff.avatar} style={{ border: '2px solid #fff', backgroundColor: '#1890ff' }}>
                {getStaffInitials(staff.fullName || "")}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      </div>
    </div>
  </div>
</Col>
  );

  // Render building card
  const renderBuildingCard = (building: BuildingCardData) => {
  // Xác định tag hiển thị loại hình giao dịch (Bán hoặc Cho thuê)
  const isSale = building.transactionType?.toUpperCase().includes("BAN") || !building.rentPrice;
  const transactionLabel = isSale ? "Nhà Bán" : "Nhà Cho thuê";
  const transactionColor = isSale ? "#0091ff" : "#ffbc00";

  return (
    <Col key={`building-${building.id}`} xs={24} sm={12} lg={8} xl={8}>
      <div
        className="assignment-card-new"
        onClick={() => setSelectedModal({ type: "building", id: building.id! })}
        style={{ cursor: 'pointer' }}
      >
        {/* --- Header Section --- */}
        <div className="card-header-new" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="card-code" style={{ fontSize: '13px', color: '#8c8c8c' }}>
            ID: #{building.id}
          </div>
          <Tag
            style={{
              margin: 0,
              backgroundColor: transactionColor,
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '2px 14px',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            {transactionLabel}
          </Tag>
        </div>

        {/* --- Title & Image Horizontal Section --- */}
        <div className="card-title-section" style={{ display: 'flex', gap: '16px', marginTop: '12px', alignItems: 'center' }}>
          {building.avatar || building.image ? (
            <img
              src={building.avatar || building.image}
              alt={building.name}
              style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                backgroundColor: '#e8e8e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '11px'
              }}
            >
              No Image
            </div>
          )}
          <div>
            <div className="card-name" style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '2px' }}>
              {building.name}
            </div>
            {/* <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
              {building.code || "S7.01 - 2312"}
            </div> */}
          </div>
        </div>

        {/* --- Body Section (Thông tin chi tiết tòa nhà) --- */}
        <div className="card-body-new" style={{ marginTop: '20px' }}>
          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="info-icon-label price" style={{ color: '#8c8c8c', fontSize: '13px' }}>Giá tiền</span>
            <span className="info-value" style={{ fontWeight: 500, color: '#000' }}>
              {formatPrice(isSale ? building.priceSale : building.priceRent || 6500000)}
            </span>
          </div>

          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="info-icon-label area" style={{ color: '#8c8c8c', fontSize: '13px' }}>Diện tích</span>
            <span className="info-value" style={{ fontWeight: 500, color: '#000' }}>
              {building.floorArea || 65} m²
            </span>
          </div>

          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
            <span className="info-icon-label location" style={{ color: '#8c8c8c', fontSize: '13px' }}>Vị trí</span>
            <span className="info-value" style={{ fontWeight: 500, color: '#000', textAlign: 'right', maxWidth: '70%' }}>
              {building.address || "Phường Long Bình, Thủ Đức"}
            </span>
          </div>

          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="info-icon-label type" style={{ color: '#8c8c8c', fontSize: '13px' }}>Loại</span>
            <span className="info-value" style={{ fontWeight: 500, color: '#000' }}>
              {building.numberOfBasement ? `${building.numberOfBasement} PN` : "2PN"}
            </span>
          </div>
          
          <Divider style={{ margin: '16px 0 12px 0', borderColor: '#f0f0f0' }} />
          
          {/* --- Staff Assignment Section --- */}
          <div className="staff-assignment-section">
            <div className="staff-label" style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '10px' }}>
              Nhân viên phụ trách
            </div>
            {building.assignedStaffs && building.assignedStaffs.length > 0 ? (
              <Avatar.Group 
                maxCount={4} 
                className="staff-avatars"
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              >
                {building.assignedStaffs.map((staff) => (
                  <Tooltip title={staff.fullName} key={staff.staffId}>
                    <Avatar 
                      // src={staff.avatar} 
                      style={{ border: '2px solid #fff', backgroundColor: '#1890ff' }}
                    >
                      {getStaffInitials(staff.fullName || "")}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            ) : (
              <span style={{ fontSize: '13px', color: '#bfbfbf', fontStyle: 'italic' }}>
                Chưa có nhân viên phụ trách
              </span>
            )}
          </div>
        </div>
      </div>
    </Col>
  );
};

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
                    // activeTab === 'customer' ? 
                    renderCustomerCard(card as CustomerCardData) 
                    // : renderBuildingCard(card as BuildingCardData)
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
              size="small"
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
                    // activeTab === 'customer' ? 
                    // renderCustomerCard(card as CustomerCardData) 
                    renderBuildingCard(card as BuildingCardData)
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

      {/* {selectedModal?.type === "building" && getSelectedBuilding() && (
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
      )} */}
    </>
  );
}
