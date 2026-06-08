// ChatRequest.java
package com.javaweb.model.request;

public class ChatRequest {
    private Long   roomId;
    private Long   senderId;
    private String senderType;   // "STAFF" | "CUSTOMER"
    private String senderName;
    private Long   staffId;
    private Long   customerId;
    private String content;

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
