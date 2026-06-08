import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, Card, Input, List, Space, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BankOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  EditOutlined,
  ExpandOutlined,
  HomeOutlined,
  MenuOutlined,
  PlusOutlined,
  SendOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { BuildingCardPayload, ChatRoomSummary, ChatSenderType } from "../../types/chat.type";
import { useChat } from "../../hooks/useChat";
import { ChatMemberList } from "./ChatMemberList";
import { mockRoomDetail } from "../../api/mockChatApi";

interface GroupChatBoxProps {
  chatRoomId?: number;
  room?: ChatRoomSummary;
  staffId?: number;
  customerId?: number;
  currentUserId?: number;
  currentUserName?: string;
  senderType?: ChatSenderType;
  canManageRoom?: boolean;
  onOpenAddStaff?: () => void;
  onOpenRenameRoom?: () => void;
  onRemoveStaff?: (staffId: number) => void;
  removingStaffId?: number | null;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number | null) => {
  if (value == null) return "Liên hệ";
  return currencyFormatter.format(value);
};

const compactAddress = (building: BuildingCardPayload) =>
  [building.address, building.street, building.wardName ?? building.ward, building.provinceName]
    .filter(Boolean)
    .join(", ");

const getBuildingName = (building: BuildingCardPayload) =>
  building.buildingName ?? building.name ?? `Toà nhà #${building.buildingId ?? building.id ?? ""}`;

const getBuildingImage = (building: BuildingCardPayload) => building.thumbnailUrl ?? building.avatar ?? building.image;

const getBuildingPrice = (building: BuildingCardPayload) => building.priceRent ?? building.rentPrice ?? building.priceSale;

const getBuildingId = (building: BuildingCardPayload) => building.buildingId ?? building.id;

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value?: string | number | null }> = ({
  icon,
  label,
  value,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      minHeight: 44,
      padding: "8px 10px",
      background: "#f8fafc",
      border: "1px solid #eef2f7",
      borderRadius: 8,
      minWidth: 0,
    }}
  >
    <span style={{ color: "#2563eb", fontSize: 15, flexShrink: 0 }}>{icon}</span>
    <span style={{ minWidth: 0 }}>
      <div style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1 }}>{label}</div>
      <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
        {value || "Đang cập nhật"}
      </div>
    </span>
  </div>
);

const BuildingSuggestionCard: React.FC<{ building: BuildingCardPayload; onOpenDetail?: () => void }> = ({
  building,
  onOpenDetail,
}) => {
  const imageUrl = getBuildingImage(building);
  const address = compactAddress(building);
  const price = getBuildingPrice(building);
  const area = building.floorArea ?? building.area;
  const tags = [building.transactionType, building.propertyType, ...(building.typeCode ?? [])].filter(Boolean);

  return (
    <div
      onClick={onOpenDetail}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && onOpenDetail) {
          event.preventDefault();
          onOpenDetail();
        }
      }}
      role={onOpenDetail ? "button" : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      style={{
        width: 360,
        maxWidth: "min(360px, calc(100vw - 120px))",
        background: "#fff",
        border: "1px solid #e6edf5",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
        cursor: onOpenDetail ? "pointer" : "default",
        marginTop: 4,
      }}
    >
      <div style={{ height: 138, background: "linear-gradient(135deg, #e8f4ff, #f6f8fb)", position: "relative" }}>
        {imageUrl ? (
          <img
            alt={getBuildingName(building)}
            src={imageUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7b8da5",
              fontSize: 38,
            }}
          >
            <BankOutlined />
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag} color="blue" style={{ margin: 0, borderRadius: 6 }}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
              {getBuildingName(building)}
            </div>
            {address && (
              <div style={{ marginTop: 6, color: "#64748b", fontSize: 13, lineHeight: 1.4 }}>
                <EnvironmentOutlined style={{ marginRight: 6, color: "#2563eb" }} />
                {address}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ color: "#0f766e", fontWeight: 800, fontSize: 15 }}>{formatCurrency(price)}</div>
            {building.rentPriceUnit && <div style={{ color: "#94a3b8", fontSize: 11 }}>{building.rentPriceUnit}</div>}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
            marginTop: 12,
          }}
        >
          <InfoPill icon={<ExpandOutlined />} label="Diện tích" value={area ? `${area} m2` : building.rentArea} />
          <InfoPill icon={<HomeOutlined />} label="Tầng" value={building.level} />
          <InfoPill icon={<CompassOutlined />} label="Hướng" value={building.direction} />
          <InfoPill icon={<TagOutlined />} label="Pháp lý" value={building.legal ?? building.rentPriceDescription} />
        </div>

        {(building.note || building.rentPriceDescription) && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              color: "#475569",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            {building.note || building.rentPriceDescription}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <Space size={6} wrap>
            {building.deposit && <Tag style={{ margin: 0 }}>Coc {building.deposit}</Tag>}
            {building.payment && <Tag style={{ margin: 0 }}>{building.payment}</Tag>}
          </Space>
          {building.linkOfBuilding && (
            <Button
              type="link"
              size="small"
              href={building.linkOfBuilding}
              target="_blank"
              onClick={(event) => event.stopPropagation()}
              style={{ paddingRight: 0 }}
            >
              Chi tiet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const GroupChatBox: React.FC<GroupChatBoxProps> = ({
  chatRoomId = 101,
  room,
  staffId,
  customerId,
  currentUserId,
  currentUserName,
  senderType,
  canManageRoom = false,
  onOpenAddStaff,
  onOpenRenameRoom,
  onRemoveStaff,
  removingStaffId,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const messageListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const userContext = useMemo(() => {
    const isStaffPath = window.location.pathname.includes("staff");
    const storedStaff = JSON.parse(localStorage.getItem("staff_info") || "{}");
    const storedCustomer = JSON.parse(localStorage.getItem("user") || "{}");
    const resolvedSenderType: ChatSenderType = senderType ?? (isStaffPath ? "STAFF" : "CUSTOMER");
    const resolvedUserId =
      currentUserId ??
      (resolvedSenderType === "STAFF" ? storedStaff?.id : storedCustomer?.id) ??
      0;
    const resolvedUserName =
      currentUserName ??
      (resolvedSenderType === "STAFF" ? storedStaff?.fullName : storedCustomer?.fullName) ??
      (resolvedSenderType === "STAFF" ? "Nhan vien" : "Khach hang");

    return {
      senderId: Number(resolvedUserId) || 0,
      senderName: String(resolvedUserName),
      senderType: resolvedSenderType,
      staffId: Number(staffId ?? storedStaff?.id ?? (resolvedSenderType === "STAFF" ? resolvedUserId : 0)) || 0,
      customerId:
        Number(customerId ?? storedCustomer?.id ?? (resolvedSenderType === "CUSTOMER" ? resolvedUserId : chatRoomId)) ||
        0,
    };
  }, [chatRoomId, currentUserId, currentUserName, customerId, senderType, staffId]);

  const { roomId, messages, connected, sendText } = useChat({
    roomId: chatRoomId,
    senderId: userContext.senderId,
    senderName: userContext.senderName,
    senderType: userContext.senderType,
  });

  const roomInfo = {
    ...mockRoomDetail,
    id: chatRoomId,
    roomName: room?.name ?? room?.roomCode ?? `Phong chat ${roomId ?? chatRoomId}`,
    members: room?.members?.length ? room.members : mockRoomDetail.members,
  };

  useEffect(() => {
    const list = messageListRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (!content) return;

    sendText(content);
    setInputValue("");
  };

  const openBuildingDetail = (building: BuildingCardPayload) => {
    const buildingId = getBuildingId(building);
    if (!buildingId) return;

    const path = window.location.pathname;
    if (path.includes("/admin")) {
      navigate(`/admin/buildings/${buildingId}`);
      return;
    }
    if (path.includes("/staff")) {
      navigate(`/staff/buildings/${buildingId}`);
      return;
    }
    navigate(`/buildings/${buildingId}`);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f5f5f5",
        minHeight: "500px",
        height: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showMembers ? "minmax(0, 2fr) minmax(220px, 1fr)" : "minmax(0, 1fr)",
          gap: 16,
          height: "100%",
          minHeight: 0,
          boxSizing: "border-box",
        }}
      >
        <div style={{ minWidth: 0, height: "100%", minHeight: 0 }}>
          <Card
            title={
              <Space size={10}>
                <span style={{ fontWeight: 600 }}>{roomInfo.roomName}</span>
                <Tag color={connected ? "green" : "default"}>
                  {connected ? "Online" : "Offline"}
                </Tag>
                <Button icon={<MenuOutlined />} onClick={() => setShowMembers((value) => !value)} size="small" />
              </Space>
            }
            extra={
              canManageRoom ? (
                <Space>
                  <Button icon={<EditOutlined />} onClick={onOpenRenameRoom} size="small">
                    Đổi tên
                  </Button>
                  <Button icon={<PlusOutlined />} onClick={onOpenAddStaff} size="small" type="primary">
                    Thêm
                  </Button>
                </Space>
              ) : null
            }
            bordered={false}
            style={{ borderRadius: 8, display: "flex", flexDirection: "column", height: "100%" }}
            bodyStyle={{
              boxSizing: "border-box",
              display: "flex",
              flex: 1,
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              ref={messageListRef}
              style={{
                flex: 1,
                minHeight: 0,
                marginBottom: "16px",
                overflowY: "auto",
                overscrollBehavior: "contain",
                paddingRight: "8px",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <List
                dataSource={messages}
                renderItem={(item, index) => {
                  const key = item.id ?? `${item.createdDate}-${index}`;

                  if (item.type === "SYSTEM") {
                    return (
                      <div key={key} style={{ textAlign: "center", margin: "12px 0" }}>
                        <span
                          style={{
                            background: "#e8e8e8",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            color: "#595959",
                          }}
                        >
                          {item.content}
                        </span>
                      </div>
                    );
                  }

                  const isMe = item.senderId === userContext.senderId;

                  return (
                    <List.Item
                      key={key}
                      style={{ justifyContent: isMe ? "flex-end" : "flex-start", border: "none", padding: "6px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMe ? "row-reverse" : "row",
                          alignItems: "flex-start",
                          gap: "8px",
                          width: "100%",
                        }}
                      >
                        {!isMe && <Avatar icon={<UserOutlined />} />}

                        <Space direction="vertical" align={isMe ? "end" : "start"} size={0}>
                          {!isMe && (
                            <span style={{ fontSize: "11px", color: "#8c8c8c", marginLeft: "4px" }}>
                              {item.senderName}
                            </span>
                          )}

                          {item.type === "BUILDING_CARD" && item.building ? (
                            <BuildingSuggestionCard
                              building={item.building}
                              onOpenDetail={() => openBuildingDetail(item.building!)}
                            />
                          ) : (
                            <div
                              style={{
                                background: isMe ? "#1890ff" : "#f0f2f5",
                                color: isMe ? "#fff" : "#000",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                marginTop: "4px",
                                maxWidth: "400px",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                        </Space>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>

            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Nhập tin nhắn"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onPressEnter={handleSendMessage}
                size="large"
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} size="large" />
            </Space.Compact>
          </Card>
        </div>

        {showMembers && (
          <div style={{ minWidth: 0, height: "100%", minHeight: 0, overflow: "hidden" }}>
            <ChatMemberList
              members={roomInfo.members}
              canManage={canManageRoom}
              currentUserId={userContext.senderId}
              onRemoveStaff={onRemoveStaff}
              removingStaffId={removingStaffId}
            />
          </div>
        )}
      </div>
    </div>
  );
};
