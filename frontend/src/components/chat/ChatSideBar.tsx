import React from "react";
import { Badge, Empty, Input, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ChatRoomSummary } from "../../types/chat.type";

const { Text, Title } = Typography;

interface ChatSidebarProps {
  rooms: ChatRoomSummary[];
  activeRoomId: number;
  onSelectRoom: (roomId: number) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ rooms, activeRoomId, onSelectRoom }) => {
  const getRoomTitle = (room: ChatRoomSummary) => room.name ?? room.roomCode ?? `Room ${room.id}`;
  const getLastMessage = (room: ChatRoomSummary) => {
    if (!room.lastMessage) return "Chưa có tin nhắn nào";
    if ("building" in room.lastMessage && room.lastMessage.type === "BUILDING_CARD") {
      return room.lastMessage.building?.buildingName ?? room.lastMessage.building?.name ?? "Đã gửi tòa nhà";
    }
    return room.lastMessage.content ?? "Tin nhắn mới";
  };
  const getRoomTime = (room: ChatRoomSummary) => {
    const raw = room.time ?? room.lastMessageAt ?? room.createdDate;
    if (!raw) return "";
    if (room.time) return room.time;
    return new Date(raw).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ 
      background: "#fff", 
      height: "100%", 
      width: "100%",
      borderRight: "1px solid #f0f0f0", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      {/* Tiêu đề góc trái */}
      <div style={{ padding: "16px 24px 8px 24px" }}>
        <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: "20px" }}>
          Đoạn chat
        </Title>
      </div>

      {/* Thanh tìm kiếm hội thoại */}
      <div style={{ padding: "8px 16px 16px 16px" }}>
        <Input
          placeholder="Tìm kiếm đoạn chat..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          style={{ borderRadius: "20px", background: "#f0f2f5", border: "none" }}
          size="large"
        />
      </div>

      {/* Danh sách phòng chat */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {rooms.length === 0 ? (
          <Empty description="Chưa có đoạn chat" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 80 }} />
        ) : (
          <List
            dataSource={rooms}
            renderItem={(room) => {
            const isActive = room.id === activeRoomId;
            return (
              <div
                onClick={() => onSelectRoom(room.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#f0f2f5" : "transparent",
                  transition: "background 0.2s",
                  marginBottom: "4px"
                }}
                className="chat-sidebar-item"
              >
                {/* <div style={{ marginRight: "12px", position: "relative" }}>
                  <Avatar 
                    size={48} 
                    icon={<UserGroupAddOutlined />} 
                    style={{ backgroundColor: isActive ? "#1890ff" : "#bfbfbf" }}
                  />
                </div> */}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Text strong style={{ fontSize: "14px", color: "#050505" }} ellipsis>
                      {getRoomTitle(room)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px", marginLeft: "4px", flexShrink: 0 }}>
                      {getRoomTime(room)}
                    </Text>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                    <Text 
                      type={room.unreadCount > 0 ? undefined : "secondary"} 
                      strong={room.unreadCount > 0}
                      style={{ fontSize: "13px" }} 
                      ellipsis
                    >
                      {getLastMessage(room)}
                    </Text>
                    {room.unreadCount > 0 && (
                      <Badge count={room.unreadCount} style={{ backgroundColor: "#1890ff" }} />
                    )}
                  </div>
                </div>
              </div>
            );
            }}
          />
        )}
      </div>
    </div>
  );
};
