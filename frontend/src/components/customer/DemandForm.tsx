import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Slider,
  Button,
  message,
  Radio,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  CarOutlined,
  InsertRowLeftOutlined,
} from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";
import {
  getProvinces,
  getWardsByProvince,
  type Province,
  type Ward,
} from "../../api/administrativeApi";
import type { DemandFormValues } from "../../types";
import "../../styles/DemandFormSection.css";
import userApi from "../../api/userApi";

interface CustomerRequestPayload {
  customerId?: string | number; // Có thể có hoặc không, tùy vào logic của bạn
  fullName: string;
  phone: string;
  email: string;
  demand: {
    propertyType: string;
    transactionType?: string; // "SALE" hoặc "RENT"
    area: number;
    price: number;
    location: string;
    priorityType?: string;
  };
  status: "NEW";
}

const propertyTypeOptions = [
  { label: "Căn Hộ", value: "APARTMENT" },
  { label: "Mặt bằng kinh doanh", value: "RETAIL" },
  { label: "Kho bãi", value: "WAREHOUSE" },
  { label: "Văn phòng", value: "OFFICE" },
];

const priorityTypes = [
  { icon: HomeOutlined, label: "Mặc định", value: "DEFAULT" },
  { icon: DollarOutlined, label: "Tiết kiệm", value: "SAVINGS" },
  { icon: CarOutlined, label: "Tiện lợi", value: "PROFIT" },
  { icon: InsertRowLeftOutlined, label: "Không gian thoải mái", value: "SPACE" },
];

// const propertyTypes = [
//   { icon: HomeOutlined, label: "Căn Hộ", value: "APARTMENT" },
//   { icon: BankOutlined, label: "Mặt bằng kinh doanh", value: "RETAIL" },
//   { icon: InsertRowLeftOutlined, label: "Kho bãi", value: "WAREHOUSE" },
//   { icon: ShoppingOutlined, label: "Văn phòng", value: "OFFICE" },
// ];
interface DemandFormSectionProps {
  // Định nghĩa hàm onSubmit nhận dữ liệu nhu cầu khách hàng
  onSubmit?: () => void;
}

const DemandFormSection: React.FC<DemandFormSectionProps> = ({ onSubmit }) => {
  const [form] = Form.useForm<DemandFormValues>();
  const [activeTab, setActiveTab] = useState<"sale" | "rent">("sale");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    1000000000, 5000000000,
  ]);
  const [loading, setLoading] = useState(false);

  // State for provinces and wards
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        message.error("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch wards when province changes
  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    form.setFieldValue("ward", undefined); // Reset ward when province changes
    setLoadingWards(true);
    try {
      const data = await getWardsByProvince(provinceCode);
      setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
      message.error("Không thể tải danh sách phường/xã");
      setWards([]);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleFinish = async (values: DemandFormValues) => {
  setLoading(true);
  try {
    // --- BƯỚC 1: TỰ ĐỘNG TẠO USER 
    let customerId: string | number | undefined;
    
    try {
      const userPayload = {
        userName: values.email, // Dùng email làm username
        password: "DefaultPassword123", // Mật khẩu tạm thời
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        status: 1,
        roleCode: "CUSTOMER"
      };
      
      const userRes = await userApi.createUser(userPayload);
      // Lấy ID vừa tạo từ ResponseDTO
      customerId = userRes?.data?.id || userRes.data?.id;
    } catch (err) {
      // Nếu lỗi do User đã tồn tại, bạn có thể cần một API tìm User theo Email 
      // để lấy lại ID cũ, hoặc backend trả về ID trong lỗi.
      console.log("Lỗi khi tạo người dùng:", err);
      console.log("Tiếp tục gửi demand...");
    }

    // --- BƯỚC 2: GỬI YÊU CẦU TÌM NHÀ VỚI CUSTOMER ID ---
    const provinceName = provinces.find(p => p.code === values.province)?.name || "";
    const wardName = wards.find(w => w.code === values.ward)?.name || "";

    const payload: CustomerRequestPayload = {
      customerId: customerId, // ID lấy từ bước 1
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      demand: {
        propertyType: values.propertyType,
        area: Number(values.area),
        price: priceRange[1],
        location: `${wardName}, ${provinceName}`,
        transactionType: activeTab === "sale" ? "SALE" : "RENT",
      },
      status: "NEW",
    };

    await axiosClient.post("/api/customer/customer-request", payload);
    message.success("Yêu cầu đã được gửi và tài khoản khách hàng đã được tạo!");
    
    form.resetFields();
  } catch (error) {
    message.error("Thao tác thất bại, vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};

  const formatPrice = (value: number) => {
    return `${(value) < 1000000000 ? (value/1000000).toFixed(1) + " triệu" : (value/1000000000).toFixed(2) + " tỷ"} VNĐ`;
  };

  return (
    <section className="demand-form-section">
      <div className="demand-form-bg" />
      <div className="demand-form-container">
        {/* Header */}
        <div className="demand-form-header">
          <h2 className="demand-form-title">Hãy Chia Sẻ Nhu Cầu Của Bạn</h2>
          <p className="demand-form-desc">
            Khám phá những căn nhà, biệt thự và bất động sản tuyệt vời
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="custom-tabs-container">
          <button
            className={`custom-tab ${activeTab === "sale" ? "active" : ""}`}
            onClick={() => setActiveTab("sale")}
          >
            Nhà đất bán
          </button>
          <button
            className={`custom-tab ${activeTab === "rent" ? "active" : ""}`}
            onClick={() => setActiveTab("rent")}
          >
            Nhà đất cho thuê
          </button>
        </div>

        {/* Glassmorphic Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="glassmorphic-form"
        >
          {/* Row 0: Contact Information */}
          <Row gutter={[32, 0]} style={{ marginBottom: 40 }}>
            <Col xs={24} md={12}>
              <div className="form-group-inline">
                <label className="form-label">Họ và Tên</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="fullName"
                    className="no-margin"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input
                      className="form-input-glass"
                      placeholder="Nguyễn Văn A"
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="form-group-inline">
                <label className="form-label">Số Điện Thoại</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="phone"
                    className="no-margin"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input
                      className="form-input-glass"
                      placeholder="0987654321"
                      type="tel"
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>

          {/* Row: Email + Property Type */}
          <Row gutter={[32, 0]}>
            <Col xs={24} md={12}>
              <div className="form-group-inline">
                <label className="form-label">Email</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="email"
                    className="no-margin"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input
                      className="form-input-glass"
                      placeholder="nguyenvana@email.com"
                      type="email"
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="form-group-inline">
                <label className="form-label">Loại Bất Động Sản</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="propertyType"
                    className="no-margin"
                    rules={[
                      { required: true, message: "Vui lòng chọn loại BĐS" },
                    ]}
                  >
                    <Select
                      className="form-select-glass"
                      placeholder="Chọn loại bất động sản"
                      options={propertyTypeOptions}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>

          {/* Row 1: Area + Price Range */}
          <Row gutter={[32, 0]} align="middle">
            <Col xs={24} lg={12}>
              <div className="form-group-inline">
                <label className="form-label">Diện Tích (m²)</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="area"
                    className="no-margin"
                    rules={[
                      { required: true, message: "Vui lòng nhập diện tích" },
                    ]}
                  >
                    <Input
                      className="form-input-glass"
                      placeholder="VD: 50"
                      type="number"
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="form-group-inline">
                <label className="form-label">Khoảng Giá</label>
                <div className="form-input-wrapper">
                  <div className="price-slider-wrapper">
                    <Form.Item name="priceRange" className="no-margin">
                      <Slider
                        className="price-slider"
                        range
                        min={0}
                        max={10000000000}
                        step={10000000}
                        value={priceRange}
                        onChange={(val) =>
                          setPriceRange(val as [number, number])
                        }
                        marks={{
                          0: "0 VND",
                          10000000000: "10 tỷ VND",
                        }}
                      />
                    </Form.Item>
                    <div className="price-display">
                      {formatPrice(priceRange[0])} -{" "}
                      {formatPrice(priceRange[1])}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Row 2: Location + Submit Button */}
          <Row gutter={[32, 0]} align="bottom" className="form-row-2">
            <Col xs={24} lg={12}>
              <div className="location-group">
                <label className="form-label">Vị Trí</label>
                <Row gutter={[12, 0]}>
                  <Col flex={1}>
                    <Form.Item
                      name="province"
                      className="no-margin"
                      rules={[
                        { required: true, message: "Vui lòng chọn tỉnh" },
                      ]}
                    >
                      <Select
                        className="form-select-glass"
                        placeholder="Tỉnh/Thành phố"
                        loading={loadingProvinces}
                        onChange={handleProvinceChange}
                        options={provinces.map((province) => ({
                          label: province.name,
                          value: province.code,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item
                      name="ward"
                      className="no-margin"
                      rules={[
                        { required: true, message: "Vui lòng chọn phường/xã" },
                      ]}
                    >
                      <Select
                        className="form-select-glass"
                        placeholder="Phường/Xã"
                        loading={loadingWards}
                        disabled={!selectedProvince}
                        options={wards.map((ward) => ({
                          label: ward.name,
                          value: ward.code,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
              </div>
            </Col>
            <Col xs={24} lg={12} style={{ textAlign: "right" }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-submit-glass"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi Yêu Cầu"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
          name="priorityType"
          initialValue={"DEFAULT"}
          className="no-margin"
          rules={[
            { required: true},
          ]}>
            {/* Property Types Grid */}
            <div className="property-types-grid">
              {priorityTypes.map((priority) => {
                const IconComponent = priority.icon;
                return (
                  <Radio.Button key={priority.value} value={priority.value} className="property-type-icon-item">
                    <div className="property-icon">
                      <IconComponent />
                    </div>
                    <div className="property-label">{priority.label}</div>
                  </Radio.Button>
                );
              })}
            </div>
        </Form.Item>
        </Form>

        
      </div>
    </section>
  );
};

export default DemandFormSection;
