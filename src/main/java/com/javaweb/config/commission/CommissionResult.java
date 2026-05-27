package com.javaweb.config.commission;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Kết quả tính hoa hồng sau khi chuyển trạng thái SIGNED → PAID.
 */
public class CommissionResult {

    private BigDecimal totalCommission;   // Tổng hoa hồng
    private BigDecimal staffCommission;   // Phần Staff hưởng
    private BigDecimal systemCommission;  // Phần hệ thống hưởng
    private String     description;       // Mô tả chi tiết

    public CommissionResult(BigDecimal totalCommission,
                            BigDecimal staffCommission,
                            BigDecimal systemCommission,
                            String description) {
        this.totalCommission  = totalCommission;
        this.staffCommission  = staffCommission;
        this.systemCommission = systemCommission;
        this.description      = description;
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    public BigDecimal getTotalCommission()  { return totalCommission; }
    public BigDecimal getStaffCommission()  { return staffCommission; }
    public BigDecimal getSystemCommission() { return systemCommission; }
    public String     getDescription()      { return description; }

    @Override
    public String toString() {
        return String.format(
                "[%s] Tổng: %,.0f đ | Staff: %,.0f đ | Hệ thống: %,.0f đ",
                description,
                totalCommission.doubleValue(),
                staffCommission.doubleValue(),
                systemCommission.doubleValue()
        );
    }
}