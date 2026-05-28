package com.javaweb.utils;

import java.math.BigDecimal;

/**
 * Engine tính điểm matching Staff ↔ Customer.
 *
 * ── Công thức ────────────────────────────────────────────────────────────────
 *
 * 1. Performance:
 *    S_Performance = min(1.0, revenue / (totalDeals * P_target))
 *    P_target mặc định = 200 triệu VNĐ
 *
 * 2. Workload:
 *    S_Workload = max(0, 1 - L_current / L_max)
 *    L_max mặc định = 10 khách
 *
 * 3. Newbie Bonus (Cold Start):
 *    DecayFactor = max(0, 1 - t / T)
 *    Bonus = ScoreBoost * DecayFactor (ScoreBoost = 0.3, T = 60 ngày)
 *
 * 4. Tổng điểm Staff-Customer:
 *    Score_CS = (Score_Area × 0.35) + (S_Performance × 0.4) + (S_Workload × 0.25)
 *              + Newbie Bonus (nếu có)
 */
public class StaffMatchingScoreCalculator {

    // Hằng số mặc định
    public static final double P_TARGET_DEFAULT = 200_000_000.0; // 200 triệu VNĐ/deal
    public static final int    L_MAX_DEFAULT    = 10;
    public static final double SCORE_BOOST      = 0.3;
    public static final int    PROBATION_DAYS   = 60;

    // Trọng số Score_CS
    public static final double W_AREA        = 0.35;
    public static final double W_PERFORMANCE = 0.40;
    public static final double W_WORKLOAD    = 0.25;

    // 1. S_Performance
    public static double scorePerformance(BigDecimal revenue, Integer totalDeals, double pTarget) {
        if (revenue == null || totalDeals == null || totalDeals == 0) return 0.0;
        double denominator = totalDeals * pTarget;
        if (denominator <= 0) return 0.0;
        return Math.min(1.0, revenue.doubleValue() / denominator);
    }

    // 2. S_Workload
    public static double scoreWorkload(int currentLoad, int lMax) {
        if (lMax <= 0) return 0.0;
        return Math.max(0.0, 1.0 - (double) currentLoad / lMax);
    }

    // 3. Newbie Bonus
    public static double newbieBonus(int daysWorked, int probationDays) {
        if (probationDays <= 0) return 0.0;
        double decayFactor = Math.max(0.0, 1.0 - (double) daysWorked / probationDays);
        return SCORE_BOOST * decayFactor;
    }

    // 4. Tổng điểm Score_CS
    public static double totalScoreCS(double sArea, double sPerformance, double sWorkload, double bonus) {
        double base = (sArea * W_AREA) + (sPerformance * W_PERFORMANCE) + (sWorkload * W_WORKLOAD);
        return base + bonus;
    }

    // Helper
    public static double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }
}