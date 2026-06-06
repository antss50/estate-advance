package com.javaweb.model.dto;

import java.util.List;

public class AssignmentCustomerDTO {

    private Long       customerId;
    private Long       demandId;    // Demand cụ thể cần assign (bắt buộc)
    private List<Long> staffIds;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getDemandId() { return demandId; }
    public void setDemandId(Long demandId) { this.demandId = demandId; }

    public List<Long> getStaffIds() { return staffIds; }
    public void setStaffIds(List<Long> staffIds) { this.staffIds = staffIds; }
}