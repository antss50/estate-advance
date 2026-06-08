// BuildingCardRequest.java
package com.javaweb.model.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.ArrayList;
import java.util.List;

public class BuildingCardRequest {
    private Long   roomId;
    private Long   senderId;
    private Long   staffId;
    private Long   customerId;
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Long> buildingId = new ArrayList<>();
    private String note;

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public List<Long> getBuildingId() { return buildingId; }
    public void setBuildingId(List<Long> buildingId) { this.buildingId = buildingId; }
    public List<Long> getBuildingIds() { return buildingId; }
    public void setBuildingIds(List<Long> buildingIds) { this.buildingId = buildingIds; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
