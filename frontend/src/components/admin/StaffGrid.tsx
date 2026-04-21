import React from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Divider,
  Tag,
  Space,
  Dropdown,
  Button,
  Spin,
} from "antd";
import { PhoneOutlined, MoreOutlined } from "@ant-design/icons";
import type { Staff } from "../../types";
import type { UserDTO } from "../../types/user.type";
import type { MenuProps } from "antd";
import { formatPhoneNumber } from "../../utils/format/phone";

const { Text } = Typography;

interface StaffGridProps {
  staffList: (Staff | UserDTO)[];
  type?: "staff" | "customer";
  onEdit?: (staff: Staff) => void;
  onDelete?: (staffId: string) => void;
  onViewDetail?: (staff: Staff | UserDTO) => void;
  onCardClick?: (staff: Staff | UserDTO) => void;
  deletingId?: string | null;
}

const PRIMARY_COLOR = "#1677ff";
const BORDER_COLOR = "#e6f4ff";
const MUTED_COLOR = "#8c8c8c";

const StaffGrid: React.FC<StaffGridProps> = ({
  staffList,
  type = "staff",
  onEdit,
  onDelete,
  onViewDetail,
  onCardClick,
  deletingId,
}) => {
  return (
    <Row gutter={[24, 24]}>
      {staffList.map((s) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Chỉnh sửa",
            onClick: (e) => {
              e.domEvent?.stopPropagation();
              onEdit?.(s as Staff);
            },
          },
          {
            key: "delete",
            label: "Xóa",
            danger: true,
            onClick: (e) => {
              e.domEvent?.stopPropagation();
              onDelete?.(s.id);
            },
          },
        ];

        // Lấy status label cho Customer
        const getStatusLabel = (status: string) => {
          const statusMap: Record<string, string> = {
            CONSULTING: "Đang tư vấn",
            SIGNED: "Đã kí hợp đồng",
            PAID: "Đã thanh toán",
          };
          return statusMap[status] || status;
        };

        // Lấy màu status cho Customer
        const getStatusColor = (status: string) => {
          const colorMap: Record<string, string> = {
            CONSULTING: "#FFD152", // xanh
            SIGNED: "#0099FF", // đỏ
            PAID: "#00FF00", // vàng
          };
          return colorMap[status] || "#1677ff";
        };

        return (
          <Col key={s.id} xs={24} sm={12} lg={8} style={{ display: "flex" }}>
            <Spin
              spinning={deletingId === s.id}
              style={{ width: "100%", height: "100%", display: "flex" }}
            >
              <Card
                hoverable
                onClick={(e) => {
                  onCardClick?.(s);
                  onViewDetail?.(s);
                  e.stopPropagation();
                }}
                style={{
                  width: "100%",
                  minWidth: 325,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "20px",
                  border: `1px solid ${BORDER_COLOR}`,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#FDFDFF",
                  cursor: "pointer",
                }}
                bodyStyle={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* ID Tag & Dropdown (chỉ hiển thị với Staff) */}
                {type === "staff" && (
                  <div
                    style={{
                      position: "absolute",
                      top: 34,
                      right: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      zIndex: 10,
                    }}
                  >
                    <Tag
                      style={{
                        backgroundColor: "#f5f5f5",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      S00{s.id}
                    </Tag>
                    <Dropdown
                      menu={{ items }}
                      trigger={["click"]}
                      // onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<MoreOutlined style={{ color: MUTED_COLOR }} />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  </div>
                )}

                {/* Header: Avatar & Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                    paddingRight: type === "staff" ? "50px" : "0",
                  }}
                >
                  <Avatar
                    size={64}
                    src={s.avatar}
                    style={{
                      border: `2px solid ${PRIMARY_COLOR}`,
                      padding: "2px",
                      backgroundColor: "white",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 16,
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        display: "-webkit-box",
                        fontSize: "16px",
                        textTransform: "uppercase",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {s.fullName}
                    </Text>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: MUTED_COLOR,
                        display: "block",
                      }}
                    >
                      @{s.userName || "user_" + s.id}
                    </Text>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <PhoneOutlined
                      style={{ color: "#000", fontSize: "14px" }}
                    />
                    <Text style={{ fontSize: "14px" }}>
                      {formatPhoneNumber(s.phone) || "0234 567 890"}
                    </Text>
                  </Space>
                </div>

                {/* Footer Section: Luôn nằm sát đáy Card nhờ marginTop: "auto" */}
                <div style={{ marginTop: "auto" }}>
                  <Divider style={{ margin: "16px 0 12px 0", opacity: 0.6 }} />
                  {type === "staff" ? (
                    // Staff Footer: Hiệu suất
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: MUTED_COLOR, fontSize: "14px" }}>
                        Hiệu suất
                      </Text>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          backgroundColor: PRIMARY_COLOR,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {(s as Staff).performance || "88"}%
                        </Text>
                      </div>
                    </div>
                  ) : (
                    // Customer Footer: Trạng thái
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: MUTED_COLOR, fontSize: "14px" }}>
                        Trạng thái
                      </Text>
                      <Tag
                        color={getStatusColor(
                          (s as UserDTO).status || "ACTIVE",
                        )}
                        style={{
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {getStatusLabel((s as UserDTO).status || "NEW")}
                      </Tag>
                    </div>
                  )}
                </div>
              </Card>
            </Spin>
          </Col>
        );
      })}
    </Row>
  );
};

export default StaffGrid;
