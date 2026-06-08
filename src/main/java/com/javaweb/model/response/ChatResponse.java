// ChatResponse.java
package com.javaweb.model.response;

import com.javaweb.enums.ChatMessageType;
import com.javaweb.enums.ChatSenderType;
import com.javaweb.model.dto.BuildingDTO;
import java.time.LocalDateTime;
import java.util.List;

public class ChatResponse {

    private Long              id;
    private Long              roomId;
    private Long              senderId;
    private ChatSenderType    senderType;
    private String            senderName;
    private ChatMessageType   type;
    private String            content;
    private BuildingDTO         building;
    private List<BuildingDTO>   buildings;
    private LocalDateTime     createdDate;

    public static ChatResponse ofText(Long id, Long roomId,
                                      Long senderId, ChatSenderType senderType,
                                      String senderName, String content,
                                      LocalDateTime createdDate) {
        ChatResponse r = new ChatResponse();
        r.id = id; r.roomId = roomId; r.senderId = senderId;
        r.senderType = senderType; r.senderName = senderName;
        r.type = ChatMessageType.TEXT; r.content = content;
        r.createdDate = createdDate;
        return r;
    }

    public static ChatResponse ofBuilding(Long id, Long roomId,
                                          Long senderId, String senderName,
                                          BuildingDTO building,
                                          LocalDateTime createdDate) {
        ChatResponse r = new ChatResponse();
        r.id = id; r.roomId = roomId; r.senderId = senderId;
        r.senderType = ChatSenderType.STAFF; r.senderName = senderName;
        r.type = ChatMessageType.BUILDING_CARD; r.building = building;
        r.createdDate = createdDate;
        return r;
    }

    public static ChatResponse ofBuildings(Long id, Long roomId,
                                           Long senderId, String senderName,
                                           List<BuildingDTO> buildings,
                                           LocalDateTime createdDate) {
        ChatResponse r = new ChatResponse();
        r.id = id; r.roomId = roomId; r.senderId = senderId;
        r.senderType = ChatSenderType.STAFF; r.senderName = senderName;
        r.type = ChatMessageType.BUILDING_CARD; r.buildings = buildings;
        if (buildings != null && !buildings.isEmpty()) r.building = buildings.get(0);
        r.createdDate = createdDate;
        return r;
    }

    public static ChatResponse ofSystem(Long roomId, String message) {
        ChatResponse r = new ChatResponse();
        r.roomId = roomId; r.type = ChatMessageType.SYSTEM;
        r.content = message; r.createdDate = LocalDateTime.now();
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
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
    public BuildingDTO getBuilding() { return building; }
    public void setBuilding(BuildingDTO building) { this.building = building; }
    public List<BuildingDTO> getBuildings() { return buildings; }
    public void setBuildings(List<BuildingDTO> buildings) { this.buildings = buildings; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
