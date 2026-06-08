import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatResponse,
  ChatRoom,
  ChatSenderType,
  SendBuildingRequest,
  SendBuildingResponse,
} from "../types/chat.type";

const API_URL = "http://localhost:8080";

interface UseChatParams {
  roomId?: number;
  senderId: number;
  senderType: ChatSenderType;
  senderName: string;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status}: ${url}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function fetchMyChatRooms(userId: number, userType: ChatSenderType) {
  return requestJson<ChatRoom[]>(`/api/chat/rooms/my?userId=${userId}&userType=${userType}`);
}

export function sendBuildingToChat(payload: SendBuildingRequest) {
  return requestJson<SendBuildingResponse>("/api/chat/rooms/send-building", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function addChatRoomMembers(roomId: number, staffIds: number[]) {
  return requestJson<ChatRoom>(`/api/chat/rooms/${roomId}/members`, {
    method: "POST",
    body: JSON.stringify({ staffIds }),
  });
}

export function removeChatRoomMember(roomId: number, staffId: number) {
  return requestJson<ChatRoom | void>(`/api/chat/rooms/${roomId}/members?userId=${staffId}&userType=STAFF`, {
    method: "DELETE",
  });
}

export function renameChatRoom(roomId: number, name: string) {
  return requestJson<ChatRoom>(`/api/chat/rooms/${roomId}/name`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export function markChatRoomRead(roomId: number, userId: number, userType: ChatSenderType) {
  return requestJson<void>(`/api/chat/rooms/${roomId}/read?userId=${userId}&userType=${userType}`, {
    method: "POST",
  });
}

export function useChat(params: UseChatParams) {
  const { roomId, senderId, senderType, senderName } = params;
  const clientRef = useRef<Client | null>(null);
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [connected, setConnected] = useState(false);

  const appendMessage = useCallback((message: ChatResponse) => {
    setMessages((prev) => {
      if (message.id && prev.some((item) => item.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  useEffect(() => {
    if (!roomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      setConnected(false);
      return;
    }

    let mounted = true;

    fetch(`${API_URL}/api/chat/rooms/${roomId}/messages?limit=20`)
      .then((res) => (res.ok ? res.json() : []))
      .then((history: ChatResponse[]) => {
        if (mounted) setMessages(history);
      })
      .catch(() => {
        if (mounted) setMessages([]);
      });

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);

        client.subscribe(
          `/topic/rooms.${roomId}`,
          (message: IMessage) => {
            const data = JSON.parse(message.body) as ChatResponse;
            appendMessage(data);
          },
          { senderName }
        );
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      mounted = false;
      setConnected(false);
      clientRef.current = null;
      void client.deactivate();
    };
  }, [appendMessage, roomId, senderName]);

  const sendText = (content: string) => {
    if (!roomId) return;
    if (!content.trim()) return;

    clientRef.current?.publish({
      destination: "/app/chat.rooms.send",
      body: JSON.stringify({
        roomId,
        senderId,
        senderType,
        senderName,
        content: content.trim(),
      }),
    });
  };

  const sendBuildingCard = async (payload: Omit<SendBuildingRequest, "createdByStaffId">) => {
    if (senderType !== "STAFF") {
      throw new Error("Only staff can send building cards");
    }

    const response = await sendBuildingToChat({
      ...payload,
      createdByStaffId: senderId,
    });

    if (response.room.id === roomId) {
      appendMessage(response.message);
    }

    return response;
  };

  const addMembers = (staffIds: number[]) => {
    if (!roomId) throw new Error("Room is not selected");
    return addChatRoomMembers(roomId, staffIds);
  };

  const removeMember = (staffId: number) => {
    if (!roomId) throw new Error("Room is not selected");
    return removeChatRoomMember(roomId, staffId);
  };

  const renameRoom = (name: string) => {
    if (!roomId) throw new Error("Room is not selected");
    return renameChatRoom(roomId, name);
  };

  return {
    roomId,
    messages,
    connected,
    sendText,
    sendBuildingCard,
    addMembers,
    removeMember,
    renameRoom,
  };
}
