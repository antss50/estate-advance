import React, { useEffect, useState } from "react";
import {
  Modal,
  Avatar,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Card,
  Progress,
  Button,
  Spin,
  message,
} from "antd";
import {
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import staffApi from "../../api/staffApi";
import type { Staff } from "../../types";

const { Text, Title } = Typography;

interface StaffDetailModalProps {
  visible: boolean;
  staffId: number | null;
  staffData?: Staff;
  onClose: () => void;
}

const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  visible,
  staffId,
  staffData,
  onClose,
}) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (staffData) {
        setStaff(staffData);
      } else if (staffId) {
        fetchStaffDetails(staffId);
      }
    }
  }, [visible, staffId, staffData]);

  const fetchStaffDetails = async (id: number) => {
    setLoading(true);
    try {
      // Gọi API GET /api/staff/{id}
      const response = await staffApi.getStaffById(id);
      setStaff(response as unknown as Staff);
    } catch (error) {
      console.error("Error fetching staff details:", error);
      message.error("Lấy thông tin nhân viên thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  return (
    <div style={{position: "relative", padding: 0}}>
      <Modal
      open={visible}
      onCancel={onClose}
      width={550}
      footer={null}
      closable={false}
      style={{ borderRadius: "24px", top: 60, padding: 20 }}
    >
      <Spin spinning={loading}>
        <div style={{ borderRadius: "36px", overflow: "hidden" }}>
          {/* Header với nút đóng */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "10px 12px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: "#8c8c8c" }}
            />
          </div>

          {/* Main Content */}
          <div style={{ padding: "28px 12px" }}>
            {staff ? (
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {/* Profile Header */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Avatar with status indicator */}
                  <div style={{ position: "relative", marginBottom: 16 }}>
                    <Avatar
                      size={96}
                      src={staff.avatar || "https://via.placeholder.com/150"}
                      style={{
                        border: "3px solid #1677ff",
                        backgroundColor: "#fff",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "28px",
                        height: "28px",
                        backgroundColor: "#52C41A",
                        borderRadius: "50%",
                        border: "3px solid white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      ✓
                    </div>
                  </div>

                  {/* Tên nhân viên */}
                  <Title
                    level={3}
                    style={{
                      margin: "12px 0 8px 0",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {staff.fullName}
                  </Title>

                  {/* Role and ID Tags */}
                  <Space>
                    <Tag
                      color="blue"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {staff.role || "STAFF"}
                    </Tag>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: "#8c8c8c",
                        fontWeight: "bold",
                      }}
                    >
                      ID:S00{staff.id}
                    </Text>
                  </Space>
                </div>

                {/* Thông tin chi tiết */}
                <div>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#8c8c8c",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 12,
                    }}
                  >
                    Thông tin chi tiết
                  </Text>

                  <Space orientation="vertical" style={{ width: "100%" }}>
                    {/* Email */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        gap: "12px",
                      }}
                    >
                      <MailOutlined
                        style={{ fontSize: "16px", color: "#1677ff" }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            display: "block",
                          }}
                        >
                          EMAIL
                        </Text>
                        <Text style={{ fontSize: "14px", display: "block" }}>
                          {staff.email || "---"}
                        </Text>
                      </div>
                    </div>

                    {/* Phone */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        gap: "12px",
                      }}
                    >
                      <PhoneOutlined
                        style={{ fontSize: "16px", color: "#1677ff" }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            display: "block",
                          }}
                        >
                          SỐ ĐIỆN THOẠI
                        </Text>
                        <Text style={{ fontSize: "14px", display: "block" }}>
                          {staff.phone || "---"}
                        </Text>
                      </div>
                    </div>

                    {/* Working Area */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        gap: "12px",
                      }}
                    >
                      <EnvironmentOutlined
                        style={{ fontSize: "16px", color: "#1677ff" }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            display: "block",
                          }}
                        >
                          KHU VỰC LÀM VIỆC
                        </Text>
                        <Text style={{ fontSize: "14px", display: "block" }}>
                          {(staff as Staff).workingArea || "---"}
                        </Text>
                      </div>
                    </div>
                  </Space>
                </div>

                {/* Thống kê */}
                <Row gutter={16}>
                  {/* Doanh thu */}
                  <Col span={12}>
                    <Card
                      style={{
                        background:
                          "linear-gradient(135deg, #1677ff 0%, #0e5fcc 100%)",
                        borderRadius: "12px",
                        border: "none",
                        color: "white",
                      }}
                      bodyStyle={{ padding: "16px", textAlign: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.9)",
                          display: "block",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Doanh thu
                      </Text>
                      <Title
                        level={2}
                        style={{
                          color: "white",
                          margin: 0,
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {formatCurrency((staff as Staff).revenue || 0)}
                      </Title>
                    </Card>
                  </Col>

                  {/* Số giao dịch */}
                  <Col span={12}>
                    <Card
                      style={{
                        background:
                          "linear-gradient(135deg, #40a9ff 0%, #1677ff 100%)",
                        borderRadius: "12px",
                        border: "none",
                        color: "white",
                      }}
                      bodyStyle={{ padding: "16px", textAlign: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.9)",
                          display: "block",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Số giao dịch
                      </Text>
                      <Title
                        level={2}
                        style={{
                          color: "white",
                          margin: 0,
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {(staff as Staff).totalDeals || 0}
                      </Title>
                    </Card>
                  </Col>
                </Row>

                {/* Hiệu suất */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <VerifiedOutlined
                        style={{ fontSize: "16px", color: "#ff4d4f" }}
                      />
                      <Text style={{ fontSize: "12px", fontWeight: "bold" }}>
                        Hiệu suất
                      </Text>
                    </div>
                    <Text
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#ff4d4f",
                      }}
                    >
                      {/* {staff.performance || 0} */}%
                    </Text>
                  </div>
                  <Progress
                    // percent={staff.performance || 0}
                    strokeColor="#ff4d4f"
                    status="normal"
                    format={() => ""}
                  />
                </div>
              </Space>
            ) : null}
          </div>
        </div>
      </Spin>
    </Modal>
    </div>
  );
};

export default StaffDetailModal;
