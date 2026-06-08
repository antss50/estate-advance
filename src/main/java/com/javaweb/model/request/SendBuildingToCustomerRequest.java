package com.javaweb.model.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.ArrayList;
import java.util.List;

public class SendBuildingToCustomerRequest {
    private Long customerId;
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Long> buildingId = new ArrayList<>();
    private Long createdByStaffId;
    private String note;
    private List<Long> staffIds = new ArrayList<>();

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public List<Long> getBuildingId() { return buildingId; }
    public void setBuildingId(List<Long> buildingId) { this.buildingId = buildingId; }
    public List<Long> getBuildingIds() { return buildingId; }
    public void setBuildingIds(List<Long> buildingIds) { this.buildingId = buildingIds; }
    public Long getCreatedByStaffId() { return createdByStaffId; }
    public void setCreatedByStaffId(Long createdByStaffId) { this.createdByStaffId = createdByStaffId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public List<Long> getStaffIds() { return staffIds; }
    public void setStaffIds(List<Long> staffIds) { this.staffIds = staffIds; }
}
