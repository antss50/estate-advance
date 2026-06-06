package com.javaweb.model.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response cho API GET /api/statistics/dashboard
 */
public class StatisticsResponse {

    // ── Doanh thu ─────────────────────────────────────────────────────────────
    private BigDecimal totalRevenue;         // Tổng doanh thu toàn hệ thống (staff + system)
    private BigDecimal totalStaffRevenue;    // Tổng hoa hồng staff đã nhận
    private BigDecimal totalSystemRevenue;   // Tổng phần hệ thống giữ lại

    // ── Giao dịch ────────────────────────────────────────────────────────────
    private int totalDeals;                  // Tổng số deals thành công (status = PAID)
    private int totalSaleDeals;              // Số deals bán
    private int totalRentDeals;              // Số deals cho thuê

    // ── Khách hàng ───────────────────────────────────────────────────────────
    private int totalCustomers;              // Tổng khách hàng
    private int totalActiveCustomers;        // Khách đang hoạt động (is_active = 1)
    private int totalNewCustomers;           // Khách mới (status = NEW)
    private int totalPaidCustomers;          // Khách đã hoàn thành (status = PAID)

    // ── Nhân viên xuất sắc ───────────────────────────────────────────────────
    private List<TopStaffResult> topStaffs;  // Top staff theo performance

    // ── Getters & Setters ────────────────────────────────────────────────────

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTotalStaffRevenue() { return totalStaffRevenue; }
    public void setTotalStaffRevenue(BigDecimal totalStaffRevenue) { this.totalStaffRevenue = totalStaffRevenue; }

    public BigDecimal getTotalSystemRevenue() { return totalSystemRevenue; }
    public void setTotalSystemRevenue(BigDecimal totalSystemRevenue) { this.totalSystemRevenue = totalSystemRevenue; }

    public int getTotalDeals() { return totalDeals; }
    public void setTotalDeals(int totalDeals) { this.totalDeals = totalDeals; }

    public int getTotalSaleDeals() { return totalSaleDeals; }
    public void setTotalSaleDeals(int totalSaleDeals) { this.totalSaleDeals = totalSaleDeals; }

    public int getTotalRentDeals() { return totalRentDeals; }
    public void setTotalRentDeals(int totalRentDeals) { this.totalRentDeals = totalRentDeals; }

    public int getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(int totalCustomers) { this.totalCustomers = totalCustomers; }

    public int getTotalActiveCustomers() { return totalActiveCustomers; }
    public void setTotalActiveCustomers(int totalActiveCustomers) { this.totalActiveCustomers = totalActiveCustomers; }

    public int getTotalNewCustomers() { return totalNewCustomers; }
    public void setTotalNewCustomers(int totalNewCustomers) { this.totalNewCustomers = totalNewCustomers; }

    public int getTotalPaidCustomers() { return totalPaidCustomers; }
    public void setTotalPaidCustomers(int totalPaidCustomers) { this.totalPaidCustomers = totalPaidCustomers; }

    public List<TopStaffResult> getTopStaffs() { return topStaffs; }
    public void setTopStaffs(List<TopStaffResult> topStaffs) { this.topStaffs = topStaffs; }
}