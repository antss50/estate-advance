// BuildingCardRequest.java
package com.javaweb.model.request;

public class BuildingCardRequest {
    private Long   staffId;
    private Long   customerId;
    private Long   buildingId;
    private String note;

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}