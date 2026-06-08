import React, { useEffect, useMemo, useState } from "react";
import { Empty, Input, Modal, Select, Spin, message } from "antd";
import { ChatSidebar } from "../../components/chat/ChatSideBar";
import { GroupChatBox } from "./GroupChatBox";
import {
  addChatRoomMembers,
  fetchMyChatRooms,
  markChatRoomRead,
  removeChatRoomMember,
  renameChatRoom,
} from "../../hooks/useChat";
import staffApi from "../../api/staffApi";
import type { ChatRoomSummary, ChatSenderType } from "../../types/chat.type";
import type { Staff } from "../../types";

interface ChatDashboardProps {
  currentUserId?: number;
  currentUserName?: string;
  userType?: ChatSenderType;
  viewerRole?: "ADMIN" | "STAFF" | "CUSTOMER";
}

export const ChatDashboard: React.FC<ChatDashboardProps> = ({
  currentUserId,
  currentUserName,
  userType,
  viewerRole,
}) => {
  const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number>(0);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loadingStaffs, setLoadingStaffs] = useState(false);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [renameOpen, setRenameOpen] = useState(false);
  const [roomNameDraft, setRoomNameDraft] = useState("");
  const [mutatingRoom, setMutatingRoom] = useState(false);
  const [removingStaffId, setRemovingStaffId] = useState<number | null>(null);

  const userContext = useMemo(() => {
    const isStaffPath = window.location.pathname.includes("staff");
    const isAdminPath = window.location.pathname.includes("admin");
    const storedStaff = JSON.parse(localStorage.getItem("staff_info") || "{}");
    const storedCustomer = JSON.parse(localStorage.getItem("user") || "{}");
    const storedAdmin = JSON.parse(localStorage.getItem("admin_info") || "{}");
    const resolvedRole = viewerRole ?? (isAdminPath ? "ADMIN" : isStaffPath ? "STAFF" : "CUSTOMER");
    const resolvedUserType: ChatSenderType = userType ?? (resolvedRole === "CUSTOMER" ? "CUSTOMER" : "STAFF");
    const staffLikeUser = resolvedRole === "ADMIN" ? (storedAdmin?.id ? storedAdmin : storedStaff) : storedStaff;
    const userId = Number(currentUserId ?? (resolvedUserType === "STAFF" ? staffLikeUser?.id : storedCustomer?.id) ?? 0);

    return {
      userId,
      userType: resolvedUserType,
      viewerRole: resolvedRole,
      userName:
        currentUserName ??
        (resolvedUserType === "STAFF" ? staffLikeUser?.fullName : storedCustomer?.fullName) ??
        (resolvedUserType === "STAFF" ? "Nhan vien" : "Khach hang"),
    };
  }, [currentUserId, currentUserName, userType, viewerRole]);

  const activeRoom = rooms.find((room) => room.id === activeRoomId);
  const canManageRoom = userContext.viewerRole === "ADMIN" || userContext.viewerRole === "STAFF";

  const loadRooms = () => {
    if (!userContext.userId) {
      setRooms([]);
      setActiveRoomId(0);
      return;
    }

    setLoadingRooms(true);
    fetchMyChatRooms(userContext.userId, userContext.userType)
      .then((data) => {
        setRooms(data);
        setActiveRoomId((current) => (data.some((room) => room.id === current) ? current : data[0]?.id || 0));
      })
      .catch(() => {
        setRooms([]);
        setActiveRoomId(0);
      })
      .finally(() => setLoadingRooms(false));
  };

  useEffect(() => {
    loadRooms();
  }, [userContext.userId, userContext.userType]);

  useEffect(() => {
    if (!activeRoomId || !userContext.userId) return;

    markChatRoomRead(activeRoomId, userContext.userId, userContext.userType)
      .then(() => {
        setRooms((prevRooms) =>
          prevRooms.map((room) => (room.id === activeRoomId ? { ...room, unreadCount: 0 } : room)),
        );
      })
      .catch((error) => {
        console.error("Mark room read error:", error);
      });
  }, [activeRoomId, userContext.userId, userContext.userType]);

  const handleSelectRoom = (roomId: number) => {
    setActiveRoomId(roomId);
    setRooms((prevRooms) => prevRooms.map((room) => (room.id === roomId ? { ...room, unreadCount: 0 } : room)));
  };

  const openAddStaff = () => {
    setAddStaffOpen(true);
    if (staffs.length > 0) return;

    setLoadingStaffs(true);
    staffApi
      .getStaffs()
      .then(setStaffs)
      .catch(() => message.error("Khong tai duoc danh sach staff"))
      .finally(() => setLoadingStaffs(false));
  };

  const handleAddStaff = async () => {
    if (!activeRoomId || selectedStaffIds.length === 0) return;

    setMutatingRoom(true);
    try {
      await addChatRoomMembers(activeRoomId, selectedStaffIds);
      message.success("Da them staff vao phong chat");
      setAddStaffOpen(false);
      setSelectedStaffIds([]);
      loadRooms();
    } catch (error) {
      console.error("Add chat members error:", error);
      message.error("Them staff that bai");
    } finally {
      setMutatingRoom(false);
    }
  };

  const openRenameRoom = () => {
    setRoomNameDraft(activeRoom?.name ?? activeRoom?.roomCode ?? "");
    setRenameOpen(true);
  };

  const handleRenameRoom = async () => {
    const name = roomNameDraft.trim();
    if (!activeRoomId || !name) return;

    setMutatingRoom(true);
    try {
      await renameChatRoom(activeRoomId, name);
      message.success("Đã đổi tên phòng chat");
      setRenameOpen(false);
      loadRooms();
    } catch (error) {
      console.error("Rename chat room error:", error);
      message.error("Đổi tên phòng thất bại");
    } finally {
      setMutatingRoom(false);
    }
  };

  const handleRemoveStaff = async (staffId: number) => {
    if (!activeRoomId) return;

    setRemovingStaffId(staffId);
    try {
      await removeChatRoomMember(activeRoomId, staffId);
      message.success("Đã xoá nhân viên khỏi phòng chat");
      loadRooms();
    } catch (error) {
      console.error("Remove chat member error:", error);
      message.error("Xoá nhân viên thất bại");
    } finally {
      setRemovingStaffId(null);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
        position: "relative",
        height: "calc(100vh - 140px)",
        minHeight: "550px",
      }}
    >
      {loadingRooms && (
        <div
          style={{
            alignItems: "center",
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
            zIndex: 10,
          }}
        >
          <Spin />
        </div>
      )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 1fr) minmax(0, 3fr)",
            height: "100%",
            minHeight: "550px",
            overflow: "hidden",
          }}
        >
          <div style={{ height: "100%", minWidth: 0, minHeight: 0, overflow: "hidden" }}>
            <ChatSidebar rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={handleSelectRoom} />
          </div>

          <div style={{ height: "100%", minWidth: 0, minHeight: 0, overflow: "hidden" }}>
            {activeRoomId ? (
              <GroupChatBox
                chatRoomId={activeRoomId}
                room={activeRoom}
                currentUserId={userContext.userId}
                currentUserName={userContext.userName}
                senderType={userContext.userType}
                canManageRoom={canManageRoom}
                onOpenAddStaff={openAddStaff}
                onOpenRenameRoom={openRenameRoom}
                onRemoveStaff={handleRemoveStaff}
                removingStaffId={removingStaffId}
              />
            ) : (
              <div style={{ alignItems: "center", display: "flex", height: "100%", justifyContent: "center" }}>
                <Empty description="Chưa có phòng chat nào" />
              </div>
            )}
          </div>
        </div>

      <Modal
        title="Thêm nhân viên vào phòng chat"
        open={addStaffOpen}
        onCancel={() => setAddStaffOpen(false)}
        onOk={handleAddStaff}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={mutatingRoom}
        okButtonProps={{ disabled: selectedStaffIds.length === 0 }}
      >
        <Select
          mode="multiple"
          placeholder="Chọn nhân viên"
          loading={loadingStaffs}
          style={{ width: "100%" }}
          value={selectedStaffIds}
          onChange={setSelectedStaffIds}
          options={staffs
            .filter((staff) => !activeRoom?.members?.some((member) => member.userType === "STAFF" && member.userId === staff.id))
            .map((staff) => ({
              value: staff.id,
              label: `${staff.fullName} (${staff.userName})`,
            }))}
        />
      </Modal>

      <Modal
        title="Đổi tên phòng chat"
        open={renameOpen}
        onCancel={() => setRenameOpen(false)}
        onOk={handleRenameRoom}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={mutatingRoom}
        okButtonProps={{ disabled: !roomNameDraft.trim() }}
      >
        <Input
          placeholder="VD: Nhóm tư vấn khách hàng VIP"
          value={roomNameDraft}
          onChange={(event) => setRoomNameDraft(event.target.value)}
          onPressEnter={handleRenameRoom}
        />
      </Modal>
    </div>
  );
};

export default ChatDashboard;
