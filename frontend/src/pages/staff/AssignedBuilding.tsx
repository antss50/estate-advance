import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Select,
  Slider,
  Button,
  Row,
  Col,
  Pagination,
  Spin,
  message,
} from "antd";

import type {
  BuildingSearchResponse,
} from "../../types/building.type";
import BuildingCard from "../../components/staff/BuildingCard";
import { Link } from "react-router-dom";
import staffApi from "../../api/staffApi";

interface BuildingCardType {
  id: string;
  buidlingId: number | string;
  title: string;
  price: string;
  area: string;
  location: string;
  description: string;
  image: string;
  buildingName: string;
  rentPrice?: number;
  salePrice?: number;
  priceRent?: number;
  priceSale?: number;
  structure?: string;
  note?: string;
}

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const PRIMARY = "#27A5FF";
const MUTED = "#8B8787";

const PAGE_SIZE = 6;

const AssignedBuilding: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [buildings, setBuildings] = useState<BuildingCardType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    0, 10000000000,
  ]);

  // Map API response to BuildingCardType
  const mapToBuildingCard = (building: BuildingSearchResponse): BuildingCardType => {
    const actualId = building.buildingId || building.id || "";

    const rentPriceVal = building.priceRent || building.rentPrice;
    const salePriceVal = building.priceSale || building.priceSale;

    const displayPrice = rentPriceVal 
      ? `${rentPriceVal.toLocaleString("vi-VN")} VNĐ/tháng`
      : salePriceVal
        ? `${salePriceVal.toLocaleString("vi-VN")} VNĐ`
        : "Liên hệ";
    
    const finalImage = building.avatar || building.imageUrls?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop";
    
    return {
      id: String(actualId),
      buidlingId: actualId,
      title: building.name || building.buildingName || "Chưa có tiêu đề",
      buildingName: building.name || building.buildingName || "Chưa có tiêu đề",
      price: displayPrice,
      rentPrice: rentPriceVal,
      salePrice: salePriceVal,
      priceRent: rentPriceVal,
      priceSale: salePriceVal,
      area: building.floorArea ? `${building.floorArea} m2` : "---",
      location: building.address || "---",
      description: building.type || "Bất động sản cho thuê",
      image: finalImage, 
      structure: building.structure || "Chưa có thông tin cấu trúc",
      note: building.note || "Chưa có thông tin mô tả chi tiết",
    };
  };

  // Fetch buildings from API
  const fetchBuildings = useCallback(async (currentPage: number, searchQuery: string) => {
    setLoading(true);
    try {
      // 1. Lấy thông tin Staff đăng nhập từ bộ nhớ tạm để bóc tách ID
      const staffInfoStr = localStorage.getItem("staff_info");
      if (!staffInfoStr) {
        message.error("Không tìm thấy thông tin định danh nhân viên. Vui lòng đăng nhập lại.");
        return;
      }
      const staffInfo = JSON.parse(staffInfoStr);
      const staffId = staffInfo.id; 

      if (!staffId) {
        message.error("Mã số nhân viên không hợp lệ.");
        return;
      }

      const response = await staffApi.getBuildingByStaff(staffId);
      const rawBuildings = Array.isArray(response) ? response : [];

      const filteredBuildings = rawBuildings.filter((b: BuildingSearchResponse) => {
        const bName = b.name || b.buildingName || "";
        const nameMatch = searchQuery
          ? bName.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        const price = b.priceRent || b.priceSale || 0;
        const priceMatch = price >= sliderValue[0] && price <= sliderValue[1];

        return nameMatch && priceMatch;
      });

      // 4. Phân trang dữ liệu hiển thị 
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedBuildings = filteredBuildings.slice(startIndex, endIndex);

      // 5. Cập nhật dữ liệu chuyển đổi lên State giao diện
      const mappedBuildings = paginatedBuildings.map(mapToBuildingCard);
      
      console.log("Mảng chuẩn bị truyền xuống giao diện Card con:", mappedBuildings);
      setBuildings(mappedBuildings);
      setTotal(filteredBuildings.length);

    } catch (err) {
      console.error("Failed to fetch buildings for staff:", err);
      message.error("Không thể tải danh sách tòa nhà đang phụ trách");
    } finally {
      setLoading(false);
    }
  }, [sliderValue]);

  useEffect(() => {
    fetchBuildings(page, searchName);
  }, [page]);

  const onPageChange = (p: number) => setPage(p);

  const handleSearch = (value: string) => {
    setSearchName(value);
    setPage(1);
    fetchBuildings(1, value);
  };

  const handleReset = () => {
    setSearchName("");
    setPage(1);
    setSliderValue([0, 10000000000]);
    fetchBuildings(1, "");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Content style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>
            Toà nhà của tôi
          </Title>
          <Text style={{ color: MUTED }}>Welcome to Estate Advance</Text>
        </div>

        {/* Filter Bar */}
        <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 24 }}>
  <Row gutter={[16, 16]} align="middle">
    {/* Ô tìm kiếm */}
    <Col xs={24} lg={8}>
      <Search
        placeholder="Tìm kiếm toà nhà..."
        enterButton
        allowClear
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        onSearch={handleSearch}
        style={{ width: "100%" }}
      />
    </Col>

    {/* Các bộ lọc Select */}
    <Col xs={24} sm={12} lg={4}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text style={{ color: MUTED, fontSize: 12 }}>Chọn loại nhà đất</Text>
        <Select
          defaultValue="All"
          style={{ fontWeight: 700, width: "100%" }}
          options={[
            { value: "All", label: "Tất cả" },
            { value: "APARTMENT", label: "Chung cư" },
            { value: "OFFICE", label: "Văn phòng" },
            { value: "RETAIL", label: "Mặt bằng kinh doanh" },
            { value: "WAREHOUSE", label: "Kho bãi" },
          ]}
        />
      </div>
    </Col>

    <Col xs={24} sm={12} lg={4}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text style={{ color: MUTED, fontSize: 12 }}>Khu vực</Text>
        <Select
          defaultValue="Hồ Chí Minh"
          style={{ fontWeight: 700, width: "100%" }}
          options={[
            { value: "All", label: "Tất cả" },
            { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
            { value: "Hà Nội", label: "Hà Nội" },
            { value: "Đà Nẵng", label: "Đà Nẵng" },
            { value: "Hải Phòng", label: "Hải Phòng" },
          ]}
        />
      </div>
    </Col>

    {/* Khoảng giá */}
    <Col xs={24} md={16} lg={6}>
      <Text style={{ color: MUTED, fontSize: 12 }}>Khoảng giá</Text>
      <Slider
        range
        min={0}
        max={10000000000}
        value={sliderValue}
        onChange={(v) => setSliderValue(v as [number, number])}
        trackStyle={[{ backgroundColor: PRIMARY }]}
        handleStyle={[{ borderColor: PRIMARY }, { borderColor: PRIMARY }]}
      />
    </Col>

    {/* Nút Đặt lại */}
    <Col xs={24} md={8} lg={2} style={{ textAlign: "right" }}>
      <Button
        type="primary"
        shape="round"
        onClick={handleReset}
        style={{
          background: PRIMARY,
          borderColor: PRIMARY,
          width: "100%"
        }}
      >
        Đặt lại
      </Button>
    </Col>
  </Row>
</div>

        {/* Grid */}
        <Spin spinning={loading} tip="Đang tải...">
          <Row gutter={[24, 24]}>
            {buildings.map((b) => (
              <Col
                key={b.id}
                xs={24}
                sm={12}
                md={8}
                style={{ display: "flex" }}
              >
                <Link to={`/staff/buildings/${b.id}`} style={{ width: "100%" }}>
                  <BuildingCard building={b} />
                </Link>
              </Col>
            ))}
          </Row>
        </Spin>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={onPageChange}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default AssignedBuilding;
