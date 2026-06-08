package com.javaweb.model.response;

import com.javaweb.enums.ChatRoomStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ChatRoomResponse {
    private Long id;
    private String roomCode;
    private String name;
    private Long customerId;
    private Long createdByStaffId;
    private ChatRoomStatus status;
    private LocalDateTime createdDate;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
    private List<ChatRoomMemberResponse> members = new ArrayList<>();
    private ChatResponse lastMessage;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getCreatedByStaffId() { return createdByStaffId; }
    public void setCreatedByStaffId(Long createdByStaffId) { this.createdByStaffId = createdByStaffId; }
    public ChatRoomStatus getStatus() { return status; }
    public void setStatus(ChatRoomStatus status) { this.status = status; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
    public List<ChatRoomMemberResponse> getMembers() { return members; }
    public void setMembers(List<ChatRoomMemberResponse> members) { this.members = members; }
    public ChatResponse getLastMessage() { return lastMessage; }
    public void setLastMessage(ChatResponse lastMessage) { this.lastMessage = lastMessage; }
}
