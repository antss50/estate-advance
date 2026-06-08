export type ChatMessageType = "TEXT" | "BUILDING_CARD" | "SYSTEM";
export type ChatSenderType = "STAFF" | "CUSTOMER";

export interface ChatResponse {
  id?: number;
  roomId: number;
  senderId?: number;
  senderType?: ChatSenderType;
  senderName?: string;
  type: ChatMessageType;
  content?: string | null;
  building?: BuildingCardPayload;
  buildings?: BuildingCardPayload[];
  createdDate?: string;
}

export interface BuildingCardPayload {
  buildingId?: number;
  id?: number;
  buildingName?: string;
  name?: string;
  address?: string;
  street?: string | null;
  provinceName?: string | null;
  wardName?: string | null;
  ward?: string | null;
  district?: string | null;
  rentPrice?: number | null;
  priceRent?: number | null;
  priceSale?: number | null;
  rentPriceUnit?: string;
  rentPriceDescription?: string | null;
  area?: number;
  floorArea?: number | null;
  rentArea?: string | null;
  thumbnailUrl?: string | null;
  avatar?: string | null;
  image?: string | null;
  transactionType?: string | null;
  propertyType?: string | null;
  structure?: string | null;
  direction?: string | null;
  numberOfBasement?: number | null;
  level?: string | null;
  legal?: string | null;
  managerName?: string | null;
  managerPhone?: string | null;
  serviceFee?: number | null;
  carFee?: number | null;
  motoFee?: number | null;
  overtimeFee?: number | null;
  deposit?: string | null;
  payment?: string | null;
  rentTime?: string | null;
  linkOfBuilding?: string | null;
  map?: string | null;
  typeCode?: string[];
  note?: string;
}

export interface ChatRoomMember {
  userId: number;
  userType?: ChatSenderType;
  role?: "CUSTOMER" | "OWNER" | "MEMBER";
  joinedAt?: string | null;
  lastReadAt?: string | null;
  displayName?: string | null;
  fullName?: string;
  roleCode?: ChatSenderType;
  avatar?: string;
}

export interface ChatMessage {
  id?: number;
  chatRoomId: number;
  senderId?: number;
  senderName?: string;
  senderAvatar?: string;
  content?: string;
  messageType: ChatMessageType;
  buildingId?: number;
}

export interface ChatRoomDetail {
  id: number;
  roomName: string;
  members: ChatRoomMember[];
}

export interface ChatRoomSummary {
  id: number;
  name?: string;
  roomCode?: string;
  customerId?: number;
  createdByStaffId?: number;
  status?: "ACTIVE" | string;
  createdDate?: string;
  lastMessageAt?: string;
  members?: ChatRoomMember[];
  lastMessage?: ChatMessage | ChatResponse;
  time?: string;
  unreadCount: number;
}

export interface ChatRoom extends Omit<ChatRoomSummary, "lastMessage"> {
  roomCode: string;
  customerId: number;
  createdByStaffId: number;
  status: "ACTIVE" | string;
  createdDate: string;
  lastMessageAt: string;
  members: ChatRoomMember[];
  lastMessage?: ChatResponse;
}

export interface SendBuildingRequest {
  customerId: number;
  buildingId: number;
  createdByStaffId: number;
  note?: string;
  staffIds: number[];
}

export interface SendBuildingResponse {
  room: ChatRoom;
  message: ChatResponse;
}

