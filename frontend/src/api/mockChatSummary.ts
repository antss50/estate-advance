import type { ChatRoomSummary } from "../types/chat.type";

export const mockChatRooms: ChatRoomSummary[] = [
    {
    id: 101,
    roomName: "Nhóm Hỗ Trợ Khách Hàng - Ta Ngoc An",
    lastMessage: {
        chatRoomId: 101,
        senderId: 54,
        senderName: "Nguyễn Văn Hùng (Sales)",
        content: "Chào anh An, em đã nhận được nhu cầu của anh. Để em lọc dự án phù hợp gửi anh nhé.",
        messageType: "TEXT"
    },
    time: "12 phút",
    unreadCount: 1
  },
  {
    id: 102,
    roomName: "Khôi Nguyễn (Staff)",
    lastMessage: {
        chatRoomId: 102,
        senderId: 55,
        senderName: "Khôi Nguyễn (Staff)",
        content: "Đã duyệt hồ sơ cọc dự án văn phòng Q3",
        messageType: "TEXT"
    },  
    time: "38 phút",
    unreadCount: 0
  },
  {
    id: 103,
    roomName: "Khoa Bóe (Customer)",
    lastMessage: {
        chatRoomId: 103,
        senderId: 56,
        senderName: "Khoa Bóe (Customer)",
        content: "Xin chào, tôi muốn được tư vấn về các dự án căn hộ tại Quận 7.",
        messageType: "TEXT"
    },
    time: "45 phút",
    unreadCount: 0
  }
]