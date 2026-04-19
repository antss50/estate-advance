package com.javaweb.model.dto;

import java.math.BigDecimal;

public class StaffDTO {
    private Long id;
    private String fullName;
    private String userName;
    private String email;
    private String phone;
    private String workingArea;
    private String role;
    private BigDecimal revenue;
    private Integer totalDeals;
    private Double performance;

    public StaffDTO() {}

    public StaffDTO(Long id, String fullName, String userName, String email,
                    String phone, String workingArea, String role,
                    BigDecimal revenue, Integer totalDeals, Double performance) {
        this.id = id;
        this.fullName = fullName;
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.workingArea = workingArea;
        this.role = role;
        this.revenue = revenue;
        this.totalDeals = totalDeals;
        this.performance = performance;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWorkingArea() {
        return workingArea;
    }

    public void setWorkingArea(String workingArea) {
        this.workingArea = workingArea;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public Integer getTotalDeals() {
        return totalDeals;
    }

    public void setTotalDeals(Integer totalDeals) {
        this.totalDeals = totalDeals;
    }

    public Double getPerformance() {
        return performance;
    }

    public void setPerformance(Double performance) {
        this.performance = performance;
    }
}