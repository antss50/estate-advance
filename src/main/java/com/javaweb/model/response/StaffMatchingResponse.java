package com.javaweb.model.response;

import java.util.List;

public class StaffMatchingResponse {

    private Long   customerId;
    private double scoreCustomer;    // Điểm đầu vào từ customer-building matching
    private int    totalFound;
    private List<StaffMatchingResult> results;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getScoreCustomer() { return scoreCustomer; }
    public void setScoreCustomer(double scoreCustomer) { this.scoreCustomer = scoreCustomer; }

    public int getTotalFound() { return totalFound; }
    public void setTotalFound(int totalFound) { this.totalFound = totalFound; }

    public List<StaffMatchingResult> getResults() { return results; }
    public void setResults(List<StaffMatchingResult> results) { this.results = results; }
}