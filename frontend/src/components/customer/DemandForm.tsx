import React, { useState } from "react";
import { Form, Row, Col, Select, Input, Slider, Button, message } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  InsertRowLeftOutlined,
  BankOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";
import type { DemandFormValues } from "../../types";
import "../../styles/DemandFormSection.css";

interface CustomerRequestPayload {
  fullName: string;
  phone: string;
  email: string;
  demand: {
    propertyType: string;
    area: number;
    price: number;
    location: string;
  };
  status: "NEW";
}

const provinceOptions = [
  { label: "Hồ Chí Minh", value: "hcm" },
  { label: "Hà Nội", value: "hanoi" },
  { label: "Đà Nẵng", value: "dn" },
];

const wardOptions = [
  { label: "Phường Ba Đình", value: "ba-dinh" },
  { label: "Phường Hoàn Kiếm", value: "hoan-kiem" },
  { label: "Phường Tây Hồ", value: "tay-ho" },
];

const propertyTypeOptions = [
  { label: "Căn Hộ", value: "apartment" },
  { label: "Biệt Thự", value: "villa" },
  { label: "Chung Cư", value: "condo" },
  { label: "Nhà Phố", value: "townhouse" },
  { label: "Shop House", value: "shophouse" },
];

const propertyTypes = [
  { icon: HomeOutlined, label: "Căn Hộ", value: "apartment" },
  { icon: BankOutlined, label: "Biệt Thự", value: "villa" },
  { icon: InsertRowLeftOutlined, label: "Chung Cư", value: "condo" },
  { icon: ShoppingOutlined, label: "Nhà Phố", value: "townhouse" },
  { icon: ShopOutlined, label: "Shop House", value: "shophouse" },
];
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

  const handleFinish = async (values: DemandFormValues) => {
    setLoading(true);
    try {
      // Lấy province label
      const provinceLabel = provinceOptions.find(
        (p) => p.value === values.province
      )?.label || values.province;
      // Lấy ward label
      const wardLabel = wardOptions.find(
        (w) => w.value === values.ward
      )?.label || values.ward;
      
      const location = `${wardLabel}, ${provinceLabel}`;
      
      // Chuẩn bị payload theo yêu cầu API
      const payload: CustomerRequestPayload = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        demand: {
          propertyType: values.propertyType,
          area: Number(values.area),
          price: priceRange[1], // Lấy giá max từ range
          location: location,
        },
        status: "NEW",
      };

      console.log("Submitting customer request:", payload);

      // Gọi API thực
      await axiosClient.post("/api/customer-request", payload);
      
      message.success("Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      form.resetFields();
      setPriceRange([1000000000, 5000000000]);
      onSubmit?.(); // Gọi callback nếu có
    } catch (error) {
      console.error("Error submitting customer request:", error);
      const axiosErr = error as Error & { response?: { data?: { message?: string } } };
      const errorMsg =
        axiosErr?.response?.data?.message ||
        axiosErr?.message ||
        "Gửi yêu cầu thất bại. Vui lòng thử lại.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    return `${(value / 1000000000).toFixed(1)}B đ`;
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
          <Row gutter={[32, 0]} style={{marginBottom:40}}>
            <Col xs={24} md={12}>
              <div className="form-group-inline">
                <label className="form-label">Họ và Tên</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="fullName"
                    className="no-margin"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
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
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
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
            <Col xs={24} md={12} >
              <div className="form-group-inline">
                <label className="form-label">Loại Bất Động Sản</label>
                <div className="form-input-wrapper">
                  <Form.Item
                    name="propertyType"
                    className="no-margin"
                    rules={[{ required: true, message: "Vui lòng chọn loại BĐS" }]}
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
                    rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}
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
                        step={100000000}
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
                      name="ward"
                      className="no-margin"
                      rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
                    >
                      <Select
                        className="form-select-glass"
                        placeholder="Phường/Xã"
                        options={wardOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item
                      name="province"
                      className="no-margin"
                      rules={[{ required: true, message: "Vui lòng chọn tỉnh" }]}
                    >
                      <Select
                        className="form-select-glass"
                        placeholder="Tỉnh"
                        options={provinceOptions}
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
        </Form>

        {/* Property Types Grid */}
        <div className="property-types-grid">
          {propertyTypes.map((property) => {
            const IconComponent = property.icon;
            return (
              <div key={property.value} className="property-type-icon-item">
                <div className="property-icon">
                  <IconComponent />
                </div>
                <div className="property-label">{property.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DemandFormSection;
