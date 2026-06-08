package com.javaweb.entity;

import com.javaweb.enums.ChatMessageType;
import com.javaweb.enums.ChatSenderType;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message",
        indexes = {
                @Index(name = "idx_room_id", columnList = "room_id"),
                @Index(name = "idx_created", columnList = "room_id, created_date")
        })
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false, length = 100)
    private String roomId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_type", nullable = false, length = 20)
    private ChatSenderType senderType;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private ChatMessageType type;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "payload", columnDefinition = "JSON")
    private String payload;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public ChatSenderType getSenderType() { return senderType; }
    public void setSenderType(ChatSenderType senderType) { this.senderType = senderType; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public ChatMessageType getType() { return type; }
    public void setType(ChatMessageType type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}