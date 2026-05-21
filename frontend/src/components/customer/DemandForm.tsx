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
import { useNavigate } from "react-router-dom";
import type { DemandFormValues } from "../../types";
import "../../styles/DemandFormSection.css";

interface CustomerRequestPayload {
  customerId: number;
  fullName: string;
  phone: string;
  email: string;
  demand: {
    propertyType: string;
    transactionType: string;
    area: number;
    price: number;
    ward: string; 
    province: string;
    priorityType: string;
    numberOfBasement?: number;
    direction?: string;
    legalStatus?: string;
    brokerageFee?: number;
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

interface DemandFormSectionProps {
  onSubmit?: () => void;
  isLoggedIn?: boolean;
}

const DemandFormSection: React.FC<DemandFormSectionProps> = ({ onSubmit, isLoggedIn }) => {
  const [form] = Form.useForm<DemandFormValues>();
  const [activeTab, setActiveTab] = useState<"sale" | "rent">("sale");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    1000000000, 5000000000,
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tự động điền (Pre-fill) thông tin cá nhân khi người dùng đã đăng nhập thành công
  useEffect(() => {
    if (isLoggedIn) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userObj = JSON.parse(savedUser);
        form.setFieldsValue({
          customerId: userObj.id,
          fullName: userObj.fullName,
          phone: userObj.phone,
          email: userObj.email,
        });
      }
    } else {
      // Nếu logout, reset toàn bộ form sạch sẽ
      form.resetFields();
    }
  }, [isLoggedIn, form]);

  const handleFinish = async (values: DemandFormValues) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập tài khoản để gửi yêu cầu tìm kiếm bất động sản!");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const savedUser = localStorage.getItem("user");
      const userObj = savedUser ? JSON.parse(savedUser) : null;

      const customerIdForHeader = userObj?.id ? String(userObj.id) : "";

      // Xây dựng payload lấy trực tiếp thông tin từ profile đã lưu hoặc từ form read-only
      const payload: CustomerRequestPayload = {
        customerId: userObj?.id || undefined, 
        fullName: userObj?.fullName || values.fullName,
        phone: userObj?.phone || values.phone,
        email: userObj?.email || values.email,
        demand: {
          propertyType: values.propertyType,
          area: Number(values.area),
          price: priceRange[1], // Giá trị kéo slider tối đa
          ward: values.ward, 
          province: values.province,
          transactionType: activeTab === "sale" ? "SALE" : "RENT",
          priorityType: values.priorityType,
          // numberOfBasement: values.numberOfBasement,
          // direction: values.direction,
          // legalStatus: values.legalStatus,
          // brokerageFee: values.brokerageFee,
        },
        status: "NEW",
      };

      await axiosClient.post("/api/customer/customer-request", payload, {
        headers: {
          "customerId": customerIdForHeader
        },
      });
      message.success("Gửi yêu cầu thành công!");
      
      // Giữ lại thông tin cá nhân, chỉ reset các thông tin nhu cầu vừa điền
      form.resetFields(["propertyType", "area", "province", "ward", "priorityType"]);
      setPriceRange([1000000000, 5000000000]); // Reset Slider về mặc định

      if (onSubmit) onSubmit();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
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
        <div className="demand-form-header">
          <h2 className="demand-form-title">Hãy Chia Sẻ Nhu Cầu Của Bạn</h2>
        </div>

        <div className="custom-tabs-container">
          <button className={`custom-tab ${activeTab === "sale" ? "active" : ""}`} onClick={() => setActiveTab("sale")}>Nhà đất bán</button>
          <button className={`custom-tab ${activeTab === "rent" ? "active" : ""}`} onClick={() => setActiveTab("rent")}>Nhà đất cho thuê</button>
        </div>

        <Form form={form} layout="vertical" onFinish={handleFinish} className="glassmorphic-form">
          {/* HÀNG THÔNG TIN CÁ NHÂN: Khóa disabled khi đã đăng nhập */}
          <Row gutter={[32, 0]} style={{ marginBottom: "24px"}}>
            <Col xs={24} md={8}>
              <Form.Item label="Họ và Tên" name="fullName">
                <Input className="form-input-glass" disabled={isLoggedIn} placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Số Điện Thoại" name="phone">
                <Input className="form-input-glass" disabled={isLoggedIn} placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email">
                <Input className="form-input-glass" disabled={isLoggedIn} placeholder="email@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <hr style={{ border: '0.5px solid rgba(255, 255, 255, 0.15)', marginBottom: '24px' }} />

          {/* HÀNG THÔNG TIN YÊU CẦU ĐẰNG SAU (DEMAND FIELDS) */}
          <Row gutter={[32, 0]}>
            <Col xs={24} md={12}>
              <Form.Item label="Loại Bất Động Sản" name="propertyType" rules={[{ required: true, message: "Vui lòng chọn loại BĐS" }]}>
                <Select className="form-select-glass" placeholder="--- Chọn loại BĐS ---" options={propertyTypeOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Diện Tích (m²)" name="area" rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}>
                <Input className="form-input-glass" placeholder="Ví dụ: 80" type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[32, 0]} style={{marginTop: "50px"}}>
            <Col xs={24} lg={12}>
              <div className="location-group">
                <label className="form-label">Vị Trí Mong Muốn</label>
                <Row gutter={[12, 0]}>
                  <Col span={12}>
                    <Form.Item name="province" rules={[{ required: true, message: "Nhập Tỉnh/Thành phố" }]}>
                      <Input className="form-input-glass" placeholder="Tỉnh/Thành phố" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="ward" rules={[{ required: true, message: "Nhập Phường/Xã" }]}>
                      <Input className="form-input-glass" placeholder="Phường/Xã" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <label className="form-label">Khoảng Giá Mong Muốn</label>
              <Slider range min={0} max={10000000000} step={10000000} value={priceRange} onChange={(val) => setPriceRange(val as [number, number])} />
              <div className="price-display">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</div>
            </Col>
          </Row>

          <Row gutter={[32, 0]} align="bottom" style={{ marginTop: '16px' }}>
            <Col xs={24} lg={16}>
              <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Chế Độ Ưu Tiên</label>
              <Form.Item name="priorityType" initialValue="DEFAULT">
                <Radio.Group className="property-types-grid" style={{ width: '100%' }}>
                  {priorityTypes.map((priority) => (
                    <Radio.Button key={priority.value} value={priority.value} className="property-type-icon-item" style={{ backgroundColor: "transparent" }}>
                      <div className="property-icon"><priority.icon /></div>
                      <div className="property-label">{priority.label}</div>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: "right", paddingBottom: '24px' }}>
              <Button type="primary" htmlType="submit" className="btn-submit-glass" loading={loading} block size="large">
                {isLoggedIn ? "Gửi Yêu Cầu Tìm Kiếm" : "Đăng nhập để gửi yêu cầu"}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default DemandFormSection;