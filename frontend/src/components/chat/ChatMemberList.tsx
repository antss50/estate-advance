import React from "react";
import { Avatar, Button, Card, List, Popconfirm, Tag, Tooltip } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import type { ChatRoomMember } from "../../types/chat.type";

interface ChatMemberListProps {
  members: ChatRoomMember[];
  canManage?: boolean;
  currentUserId?: number;
  onRemoveStaff?: (staffId: number) => void;
  removingStaffId?: number | null;
}

export const ChatMemberList: React.FC<ChatMemberListProps> = ({
  members,
  canManage = false,
  currentUserId,
  onRemoveStaff,
  removingStaffId,
}) => {
  return (
    <Card title="Thành viên" size="small" style={{ height: "100%", borderRadius: 8 }}>
      <List
        itemLayout="horizontal"
        dataSource={members}
        renderItem={(member) => {
          const memberType = member.userType ?? member.roleCode ?? "STAFF";
          const memberName = member.displayName ?? member.fullName ?? `${memberType} #${member.userId}`;
          const canRemove = canManage && memberType === "STAFF" && member.userId !== currentUserId;

          return (
            <List.Item style={{ padding: "8px 0" }}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={member.avatar}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: memberType === "CUSTOMER" ? "#1890ff" : "#52c41a" }}
                  />
                }
                title={
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
                    {memberName}
                  </span>
                }
                description={
                  <Tag color={memberType === "CUSTOMER" ? "blue" : "green"} style={{ fontSize: 10 }}>
                    {member.role ?? memberType}
                  </Tag>
                }
              />
              {canRemove && (
                <Popconfirm
                  title="Xoá nhân viên này khỏi phòng chat?"
                  okText="Xoá"
                  cancelText="Hủy"
                  onConfirm={() => onRemoveStaff?.(member.userId)}
                >
                  <Tooltip title="Xoá nhân viên">
                    <Button
                      danger
                      ghost
                      icon={<DeleteOutlined />}
                      loading={removingStaffId === member.userId}
                      size="small"
                      type="text"
                    />
                  </Tooltip>
                </Popconfirm>
              )}
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
