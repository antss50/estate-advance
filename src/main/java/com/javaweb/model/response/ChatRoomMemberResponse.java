package com.javaweb.model.response;

import com.javaweb.enums.ChatMemberRole;
import com.javaweb.enums.ChatSenderType;

import java.time.LocalDateTime;

public class ChatRoomMemberResponse {
    private Long userId;
    private String displayName;
    private ChatSenderType userType;
    private ChatMemberRole role;
    private LocalDateTime joinedAt;
    private LocalDateTime lastReadAt;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public ChatSenderType getUserType() { return userType; }
    public void setUserType(ChatSenderType userType) { this.userType = userType; }
    public ChatMemberRole getRole() { return role; }
    public void setRole(ChatMemberRole role) { this.role = role; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
    public LocalDateTime getLastReadAt() { return lastReadAt; }
    public void setLastReadAt(LocalDateTime lastReadAt) { this.lastReadAt = lastReadAt; }
}
