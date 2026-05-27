package com.javaweb.config.commission;

/**
 * Cấu hình tỷ lệ hoa hồng toàn hệ thống.
 *
 * Tách ra thành config riêng để dễ thay đổi mà không cần sửa business logic.
 *
 * ── Nhà đất BÁN ──────────────────────────────────────────────────────────────
 *   Tổng hoa hồng        = SALE_COMMISSION_RATE × Giá trị hợp đồng  (2%)
 *   Staff nhận           = SALE_STAFF_SHARE × Tổng hoa hồng          (50%)
 *   Hệ thống nhận        = (1 - SALE_STAFF_SHARE) × Tổng hoa hồng   (50%)
 *
 * ── Nhà đất CHO THUÊ ─────────────────────────────────────────────────────────
 *   Hợp đồng ≥ 12 tháng:
 *     Tổng hoa hồng = 1 tháng tiền thuê
 *     Staff nhận    = COMMISSION_RATE_RENT × 1 tháng tiền thuê       (50%)
 *     Hệ thống nhận = (1 - COMMISSION_RATE_RENT) × 1 tháng tiền thuê (50%)
 *
 *   Hợp đồng < 12 tháng:
 *     Tổng hoa hồng = 0.5 tháng tiền thuê
 *     Staff nhận    = COMMISSION_RATE_RENT × 0.5 tháng tiền thuê     (50%)
 *     Hệ thống nhận = (1 - COMMISSION_RATE_RENT) × 0.5 tháng tiền thuê
 *
 * Lưu ý: COMMISSION_RATE_RENT có thể điều chỉnh lên 0.6 hoặc 0.7
 * cho mảng cho thuê nếu cần (thực tế tỷ lệ chia cho thuê thường cao hơn bán).
 */
public class CommissionConfig {

    // ── BÁN ──────────────────────────────────────────────────────────────────
    /** Tổng tỷ lệ hoa hồng trên giá trị hợp đồng bán */
    public static final double SALE_COMMISSION_RATE = 0.02;   // 2%

    /** Tỷ lệ staff hưởng trên tổng hoa hồng bán (50/50) */
    public static final double SALE_STAFF_SHARE     = 0.50;   // 50%

    // ── CHO THUÊ ─────────────────────────────────────────────────────────────
    /**
     * Tỷ lệ staff hưởng trên tổng hoa hồng cho thuê.
     * Mặc định 0.5 (50/50) để đồng nhất với mảng bán.
     * Có thể tăng lên 0.6 hoặc 0.7 tuỳ chính sách công ty.
     */
    public static final double COMMISSION_RATE_RENT = 0.50;   // ← dễ chỉnh ở đây

    /** Số tháng ngưỡng phân biệt hợp đồng dài hạn / ngắn hạn */
    public static final int RENT_LONG_TERM_MONTHS = 12;

    /** Hoa hồng hợp đồng ≥ 12 tháng = X tháng tiền thuê */
    public static final double RENT_LONG_TERM_MONTH_FACTOR  = 1.0;   // 1 tháng

    /** Hoa hồng hợp đồng < 12 tháng = X tháng tiền thuê */
    public static final double RENT_SHORT_TERM_MONTH_FACTOR = 0.5;   // 0.5 tháng
}