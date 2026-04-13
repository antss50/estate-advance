import React, { useState } from "react";
import { Form, Row, Col, Select, Input, Slider, Button } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  InsertRowLeftOutlined,
  BankOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { DemandFormValues } from "../../types";
import "../../styles/DemandFormSection.css";

interface DemandFormProps {
  onSubmit: (values: DemandFormValues) => void;
}

const provinceOptions = [
  { label: "Hà Nội", value: "hanoi" },
  { label: "TP. HCM", value: "hcm" },
  { label: "Đà Nẵng", value: "dn" },
];

const wardOptions = [
  { label: "Phường Ba Đình", value: "ba-dinh" },
  { label: "Phường Hoàn Kiếm", value: "hoan-kiem" },
  { label: "Phường Tây Hồ", value: "tay-ho" },
];

const propertyTypes = [
  { icon: HomeOutlined, label: "Căn Hộ", value: "apartment" },
  { icon: BankOutlined, label: "Biệt Thự", value: "villa" },
  { icon: InsertRowLeftOutlined, label: "Chung Cư", value: "condo" },
  { icon: ShoppingOutlined, label: "Nhà Phố", value: "townhouse" },
  { icon: ShopOutlined, label: "Shop House", value: "shophouse" },
];

const DemandFormSection: React.FC<DemandFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm<DemandFormValues>();
  const [activeTab, setActiveTab] = useState<"sale" | "rent">("sale");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    1000000000, 5000000000,
  ]);

  const handleFinish = (values: DemandFormValues) => {
    onSubmit(values);
    form.resetFields();
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
          {/* Row 1: Area + Price Range */}
          <Row gutter={[32, 0]} align="middle">
            <Col xs={24} lg={12}>
              <div className="form-group-inline">
                <label className="form-label">Diện Tích (m²)</label>
                <div className="form-input-wrapper">
                  <Form.Item name="area" className="no-margin">
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
                    <Form.Item name="ward" className="no-margin">
                      <Select
                        className="form-select-glass"
                        placeholder="Phường/Xã"
                        options={wardOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name="province" className="no-margin">
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
                >
                  Gửi Yêu Cầu
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
