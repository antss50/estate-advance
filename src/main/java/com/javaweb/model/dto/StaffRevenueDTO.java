package com.javaweb.model.response;

import java.math.BigDecimal;

public class StaffRevenueDTO {
    private Long staffId;
    private String staffName;
    private String email;
    private String phone;
    private BigDecimal totalRevenue;
    private BigDecimal revenueSale;
    private BigDecimal revenueRent;
    private Integer totalDeals;
    private Integer totalSaleDeals;
    private Integer totalRentDeals;
    private Double performance;

    // Getters and Setters
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getRevenueSale() { return revenueSale; }
    public void setRevenueSale(BigDecimal revenueSale) { this.revenueSale = revenueSale; }

    public BigDecimal getRevenueRent() { return revenueRent; }
    public void setRevenueRent(BigDecimal revenueRent) { this.revenueRent = revenueRent; }

    public Integer getTotalDeals() { return totalDeals; }
    public void setTotalDeals(Integer totalDeals) { this.totalDeals = totalDeals; }

    public Integer getTotalSaleDeals() { return totalSaleDeals; }
    public void setTotalSaleDeals(Integer totalSaleDeals) { this.totalSaleDeals = totalSaleDeals; }

    public Integer getTotalRentDeals() { return totalRentDeals; }
    public void setTotalRentDeals(Integer totalRentDeals) { this.totalRentDeals = totalRentDeals; }

    public Double getPerformance() { return performance; }
    public void setPerformance(Double performance) { this.performance = performance; }
}