package com.javaweb.model.response;

public class CustomerMatchScore {
    private Long customerId;
    private String customerName;
    private String phone;
    private String email;
    private Double desiredPrice;
    private Double desiredArea;
    private String desiredWard;
    private Long staffId;
    private String staffName;
    private Double matchScore;
    private String status;

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Double getDesiredPrice() { return desiredPrice; }
    public void setDesiredPrice(Double desiredPrice) { this.desiredPrice = desiredPrice; }
    public Double getDesiredArea() { return desiredArea; }
    public void setDesiredArea(Double desiredArea) { this.desiredArea = desiredArea; }
    public String getDesiredWard() { return desiredWard; }
    public void setDesiredWard(String desiredWard) { this.desiredWard = desiredWard; }
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}