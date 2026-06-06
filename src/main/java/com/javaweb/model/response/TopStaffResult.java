package com.javaweb.model.response;

import java.math.BigDecimal;

public class TopStaffResult {

    private Long       staffId;
    private String     staffName;
    private String     email;
    private String     phone;
    private int        rank;

    // ── Doanh thu ─────────────────────────────────────────────────────────────
    private BigDecimal revenue;       // Tổng doanh thu
    private BigDecimal revenueSale;   // Doanh thu từ giao dịch bán
    private BigDecimal revenueRent;   // Doanh thu từ giao dịch cho thuê

    // ── Số deals ─────────────────────────────────────────────────────────────
    private Integer    totalDeals;
    private Integer    totalSaleDeals;
    private Integer    totalRentDeals;

    // ── Hiệu suất ─────────────────────────────────────────────────────────────
    private Double     performance;   // [0, 1] — tính từ revenue / (totalDeals × P_target)

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

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