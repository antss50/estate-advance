package com.javaweb.model.response;

import java.util.List;

public class CustomerMatchingResponse {

    private Long   customerId;
    private String customerName;   // fullName của khách — lấy từ CustomerEntity
    private String priorityType;   // Loại ưu tiên đã dùng để tính trọng số
    private int    totalFound;
    private List<BuildingMatchingResult> results;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPriorityType() { return priorityType; }
    public void setPriorityType(String priorityType) { this.priorityType = priorityType; }

    public int getTotalFound() { return totalFound; }
    public void setTotalFound(int totalFound) { this.totalFound = totalFound; }

    public List<BuildingMatchingResult> getResults() { return results; }
    public void setResults(List<BuildingMatchingResult> results) { this.results = results; }
}