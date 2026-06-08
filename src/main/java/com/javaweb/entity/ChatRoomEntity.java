package com.javaweb.entity;

import com.javaweb.enums.ChatRoomStatus;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room",
        indexes = {
                @Index(name = "idx_chat_room_customer", columnList = "customer_id"),
                @Index(name = "idx_chat_room_status", columnList = "status")
        })
public class ChatRoomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_code", nullable = false, unique = true, length = 100)
    private String roomCode;

    @Column(name = "name")
    private String name;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "created_by_staff_id", nullable = false)
    private Long createdByStaffId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ChatRoomStatus status = ChatRoomStatus.ACTIVE;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

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
}
