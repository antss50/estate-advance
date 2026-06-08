import type { ChatRoomDetail, ChatMessage } from "../types/chat.type";

export const mockRoomDetail: ChatRoomDetail = {
  id: 101,
  roomName: "Nhóm Hỗ Trợ Khách Hàng - Ta Ngoc An",
  members: [
    { userId: 1, fullName: "Ta Ngoc An", roleCode: "CUSTOMER" },
    { userId: 54, fullName: "Nguyễn Văn Hùng (Sales)", roleCode: "STAFF" },
    { userId: 55, fullName: "Trần Thị Lan (Pháp lý)", roleCode: "STAFF" }
  ]
};

export const mockHistoryMessages: ChatMessage[] = [
  {
    id: 1,
    chatRoomId: 101,
    senderId: 1,
    senderName: "Ta Ngoc An",
    content: "Xin chào, tôi cần tìm một tòa nhà văn phòng tầm 150m² tại Quận 1.",
    messageType: "TEXT"
  },
  {
    chatRoomId: 101,
    senderId: 54,
    senderName: "Nguyễn Văn Hùng (Sales)",
    content: "Chào anh An, em đã nhận được nhu cầu của anh. Để em lọc dự án phù hợp gửi anh nhé.",
    messageType: "TEXT"
  },
  {
    chatRoomId: 101,
    senderId: -1,
    senderName: "Hệ thống",
    content: "Trần Thị Lan (Pháp lý) đã được thêm vào nhóm chat.",
    messageType: "SYSTEM"
  }
];