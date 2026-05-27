package com.javaweb.config.commission;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Tính hoa hồng khi chuyển trạng thái SIGNED → PAID.
 *
 * ── Nhà đất BÁN ──────────────────────────────────────────────────────────────
 *   Tổng hoa hồng = 2% × Giá trị hợp đồng
 *   Staff         = 1% × Giá trị hợp đồng  (= 50% tổng hoa hồng)
 *   Hệ thống      = 1% × Giá trị hợp đồng  (= 50% tổng hoa hồng)
 *
 * ── Nhà đất CHO THUÊ ─────────────────────────────────────────────────────────
 *   Hợp đồng ≥ 12 tháng:
 *     Tổng hoa hồng = 1 tháng tiền thuê
 *     Staff         = COMMISSION_RATE_RENT × 1 tháng tiền thuê
 *     Hệ thống      = (1 - COMMISSION_RATE_RENT) × 1 tháng tiền thuê
 *
 *   Hợp đồng < 12 tháng:
 *     Tổng hoa hồng = 0.5 tháng tiền thuê
 *     Staff         = COMMISSION_RATE_RENT × 0.5 tháng tiền thuê
 *     Hệ thống      = (1 - COMMISSION_RATE_RENT) × 0.5 tháng tiền thuê
 */
public class CommissionCalculator {

    // ── BÁN ──────────────────────────────────────────────────────────────────

    /**
     * Tính hoa hồng cho giao dịch BÁN.
     *
     * @param contractValue Giá trị hợp đồng bán (VNĐ)
     * @return CommissionResult chứa tổng, phần staff, phần hệ thống
     */
    public static CommissionResult forSale(BigDecimal contractValue) {
        if (contractValue == null || contractValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá trị hợp đồng không hợp lệ");
        }

        BigDecimal rate       = BigDecimal.valueOf(CommissionConfig.SALE_COMMISSION_RATE);
        BigDecimal staffShare = BigDecimal.valueOf(CommissionConfig.SALE_STAFF_SHARE);

        BigDecimal totalCommission  = contractValue.multiply(rate).setScale(0, RoundingMode.HALF_UP);
        BigDecimal staffCommission  = totalCommission.multiply(staffShare).setScale(0, RoundingMode.HALF_UP);
        BigDecimal systemCommission = totalCommission.subtract(staffCommission);

        String desc = String.format(
                "Bán | Hợp đồng: %,.0f đ | Tỷ lệ: %.0f%% | Staff: %.0f%%",
                contractValue.doubleValue(),
                CommissionConfig.SALE_COMMISSION_RATE * 100,
                CommissionConfig.SALE_STAFF_SHARE * 100
        );

        return new CommissionResult(totalCommission, staffCommission, systemCommission, desc);
    }

    // ── CHO THUÊ ─────────────────────────────────────────────────────────────

    /**
     * Tính hoa hồng cho giao dịch CHO THUÊ.
     *
     * @param monthlyRent    Tiền thuê 1 tháng (VNĐ)
     * @param contractMonths Thời hạn hợp đồng thuê (tháng)
     * @return CommissionResult chứa tổng, phần staff, phần hệ thống
     */
    public static CommissionResult forRent(BigDecimal monthlyRent, int contractMonths) {
        if (monthlyRent == null || monthlyRent.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Tiền thuê không hợp lệ");
        }
        if (contractMonths <= 0) {
            throw new IllegalArgumentException("Thời hạn hợp đồng không hợp lệ");
        }

        // Xác định hệ số tháng theo thời hạn
        boolean isLongTerm = contractMonths >= CommissionConfig.RENT_LONG_TERM_MONTHS;
        double monthFactor = isLongTerm
                ? CommissionConfig.RENT_LONG_TERM_MONTH_FACTOR    // 1.0 tháng
                : CommissionConfig.RENT_SHORT_TERM_MONTH_FACTOR;  // 0.5 tháng

        BigDecimal commissionRate = BigDecimal.valueOf(CommissionConfig.COMMISSION_RATE_RENT);
        BigDecimal factor         = BigDecimal.valueOf(monthFactor);

        // Tổng hoa hồng = monthFactor × tiền thuê 1 tháng
        BigDecimal totalCommission = monthlyRent.multiply(factor).setScale(0, RoundingMode.HALF_UP);

        // Staff = COMMISSION_RATE_RENT × tổng hoa hồng
        BigDecimal staffCommission  = totalCommission.multiply(commissionRate).setScale(0, RoundingMode.HALF_UP);
        BigDecimal systemCommission = totalCommission.subtract(staffCommission);

        String desc = String.format(
                "Thuê %d tháng (%s) | Thuê/tháng: %,.0f đ | Hệ số: %.1f tháng | Staff: %.0f%%",
                contractMonths,
                isLongTerm ? "dài hạn" : "ngắn hạn",
                monthlyRent.doubleValue(),
                monthFactor,
                CommissionConfig.COMMISSION_RATE_RENT * 100
        );

        return new CommissionResult(totalCommission, staffCommission, systemCommission, desc);
    }
}