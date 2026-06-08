/**
 * AssignmentManagement.tsx
 * Example page showing how to use AssignmentGrid component
 *
 * Usage:
 * - Import this component
 * - Add route: <Route path="/admin/assignment-management" element={<AssignmentManagement />} />
 * - Add menu item in AdminLayout
 */

import React from "react";
import { Card, Row, Col, Divider } from "antd";
import AssignmentGrid from "../../components/admin/AssignmentGrid";
import "./AssignmentManagement.css";
import Title from "antd/es/typography/Title";
// import CustomerDemand from "./CustomerDemand";

  const AssignmentManagement: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="assignment-management-page">
      {/* Header Section */}
      <Row gutter={[16, 16]} className="header-section">
        <Col xs={24}>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý Phân công
          </Title>
          <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
            Chào mừng đến với Estate Advance
          </span>
        </Col>
        <Col>
          
        </Col>
      </Row>


      {/* Statistics Section (Optional) */}
      {/* <Row gutter={[16, 16]} className="stats-section">
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng Khách hàng"
            value={0} // Replace with actual count
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng Toà nhà"
            value={0}
            prefix={<BankOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Đã Phân công"
            value={0}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Chưa Phân công"
            value={0}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#f5222d" }}
          />
        </Col>
      </Row> */}

      <Divider />

      {/* Assignment Grid Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Danh sách Phân công" className="assignment-grid-card">
            <AssignmentGrid key={refreshKey} />
          </Card>
        </Col>
      </Row>

      {/* Additional Info Section (Optional) */}
      {/* <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24}>
          <Card title="Hướng dẫn sử dụng">
            <Tabs
              items={[
                {
                  key: "1",
                  label: "Thông tin Khách hàng",
                  children: (
                    <div>
                      <p>
                        <strong>Card Khách hàng hiển thị:</strong>
                      </p>
                      <ul>
                        <li>Tên và ID khách hàng</li>
                        <li>Thông tin liên hệ (điện thoại, email)</li>
                        <li>Nhu cầu: Giá tiền, diện tích, vị trí, loại</li>
                        <li>Trạng thái yêu cầu</li>
                        <li>Danh sách nhân viên phụ trách</li>
                      </ul>
                      <p>
                        <strong>Cách sử dụng:</strong> Click vào card để mở
                        modal chi tiết, chọn nhân viên để phân công, rồi nhấn
                        "Lưu phân công"
                      </p>
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: "Thông tin Toà nhà",
                  children: (
                    <div>
                      <p>
                        <strong>Card Toà nhà hiển thị:</strong>
                      </p>
                      <ul>
                        <li>Tên và ID toà nhà</li>
                        <li>Hình ảnh/avatar</li>
                        <li>
                          Thông tin: Giá cho thuê, diện tích, vị trí, loại
                        </li>
                        <li>Danh sách nhân viên phụ trách</li>
                        <li>Button "Cho thuê"</li>
                      </ul>
                      <p>
                        <strong>Cách sử dụng:</strong> Click vào card để mở
                        modal chi tiết, chọn nhân viên để phân công, rồi nhấn
                        "Lưu phân công"
                      </p>
                    </div>
                  ),
                },
                {
                  key: "3",
                  label: "Phân công Nhân viên",
                  children: (
                    <div>
                      <p>
                        <strong>Các bước phân công:</strong>
                      </p>
                      <ol>
                        <li>Click vào card khách hàng hoặc toà nhà</li>
                        <li>Xem thông tin chi tiết trong modal</li>
                        <li>Chọn/bỏ chọn nhân viên từ danh sách</li>
                        <li>Nhấn "Lưu phân công" để lưu thay đổi</li>
                        <li>Danh sách sẽ tự động cập nhật</li>
                      </ol>
                      <p style={{ color: "#f5222d" }}>
                        <strong>Lưu ý:</strong> Các thay đổi sẽ được lưu vào
                        database
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default AssignmentManagement;
