package com.javaweb.util;

import java.math.BigDecimal;

/**
 * Engine tính điểm matching Staff ↔ Customer.
 *
 * ── Công thức ────────────────────────────────────────────────────────────────
 *
 * 1. Performance:
 *    S_Performance = min(1.0, revenue / (totalDeals * P_target))
 *    P_target mặc định = 200 triệu VNĐ
 *    → Nhân viên mới (chưa có deal): S_Performance = 0
 *
 * 2. Workload:
 *    S_Workload = max(0, 1 - L_current / L_max)
 *    L_max mặc định = 10 khách
 *    → Nhân viên mới (chưa có khách): S_Workload = 1.0 (rảnh hoàn toàn)
 *
 * 3. Newbie Bonus (Cold Start):
 *    DecayFactor = max(0, 1 - t / T)
 *    Bonus = ScoreBoost * DecayFactor   (ScoreBoost = 0.3, T = 60 ngày)
 *
 * 4. Tổng điểm Staff-Customer:
 *    Score_CS = (Score_Customer × 0.4) + (S_Performance × 0.25) + (S_Workload × 0.35)
 *    + Newbie Bonus (nếu có)
 */
public class StaffMatchingScoreCalculator {

    // ── Hằng số mặc định ─────────────────────────────────────────────────────
    public static final double P_TARGET_DEFAULT      = 200_000_000.0; // 200 triệu VNĐ/deal
    public static final int    L_MAX_DEFAULT         = 10;            // Tối đa 10 khách/nhân viên
    public static final double SCORE_BOOST           = 0.3;           // Newbie bonus gốc
    public static final int    PROBATION_DAYS        = 60;            // T = 60 ngày thử việc

    // ── Trọng số tổng Score_CS ────────────────────────────────────────────────
    public static final double W_CUSTOMER    = 0.40;
    public static final double W_PERFORMANCE = 0.25;
    public static final double W_WORKLOAD    = 0.35;

    // ── 1. S_Performance ─────────────────────────────────────────────────────

    /**
     * @param revenue    Tổng doanh thu thực tế (VNĐ) — từ UserEntity.revenue
     * @param totalDeals Số deal thành công — từ UserEntity.totalDeals
     * @param pTarget    Doanh thu kỳ vọng mỗi deal (VNĐ), thường dùng P_TARGET_DEFAULT
     * @return S_Performance trong [0, 1]
     */
    public static double scorePerformance(BigDecimal revenue, Integer totalDeals, double pTarget) {
        // Cold start: chưa có deal → Performance = 0
        if (revenue == null || totalDeals == null || totalDeals == 0) return 0.0;

        double denominator = totalDeals * pTarget;
        if (denominator <= 0) return 0.0;

        return Math.min(1.0, revenue.doubleValue() / denominator);
    }

    // ── 2. S_Workload ─────────────────────────────────────────────────────────

    /**
     * @param currentLoad Số khách đang phụ trách hiện tại
     * @param lMax        Số khách tối đa (thường dùng L_MAX_DEFAULT)
     * @return S_Workload trong [0, 1]
     *         → 1.0: rảnh hoàn toàn | 0.0: đã full tải
     */
    public static double scoreWorkload(int currentLoad, int lMax) {
        if (lMax <= 0) return 0.0;
        return Math.max(0.0, 1.0 - (double) currentLoad / lMax);
    }

    // ── 3. Newbie Bonus ───────────────────────────────────────────────────────

    /**
     * Tính Newbie Bonus cho nhân viên mới (Cold Start).
     *
     * DecayFactor = max(0, 1 - t / T)
     * Bonus = ScoreBoost × DecayFactor
     *
     * @param daysWorked     t: số ngày đã đi làm (tính từ ngày onboard)
     * @param probationDays  T: số ngày thử việc (mặc định PROBATION_DAYS = 60)
     * @return bonus trong [0, SCORE_BOOST], = 0 nếu đã qua thời gian thử việc
     */
    public static double newbieBonus(int daysWorked, int probationDays) {
        if (probationDays <= 0) return 0.0;
        double decayFactor = Math.max(0.0, 1.0 - (double) daysWorked / probationDays);
        return SCORE_BOOST * decayFactor;
    }

    // ── 4. Tổng điểm Score_CS ────────────────────────────────────────────────

    /**
     * Tính tổng điểm matching Staff ↔ Customer.
     *
     * Score_CS = (Score_Customer × 0.4) + (S_Performance × 0.25) + (S_Workload × 0.35)
     *          + newbieBonus (nếu nhân viên còn trong thời gian thử việc)
     *
     * @param scoreCustomer  Điểm matching nhu cầu khách hàng (từ CustomerBuildingMatchingService)
     * @param sPerformance   Điểm hiệu suất làm việc
     * @param sWorkload      Điểm khối lượng công việc
     * @param bonus          Newbie bonus (= 0 nếu không phải nhân viên mới)
     * @return Score_CS trong [0, ~1.3] (có thể > 1 nếu bonus cộng vào)
     */
    public static double totalScoreCS(
            double scoreCustomer,
            double sPerformance,
            double sWorkload,
            double bonus) {

        double base = (scoreCustomer * W_CUSTOMER)
                + (sPerformance  * W_PERFORMANCE)
                + (sWorkload     * W_WORKLOAD);

        return base + bonus;
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    public static double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }
}