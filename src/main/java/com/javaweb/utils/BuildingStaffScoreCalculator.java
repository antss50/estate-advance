package com.javaweb.utils;

/**
 * Matching Building ↔ Staff — công thức tính điểm cho staff (không gồm Score_Building).
 *
 * Công thức đúng:
 *   TotalScore_BS = (Score_Area × 0.35) + (Score_Performance × 0.4) + (Score_Workload × 0.25) + NewbieBonus
 *
 * Score_Area: do WardLocationScorer cung cấp (1.0 cùng phường, 0.6 lân cận, 0.2 khác)
 */
public class BuildingStaffScoreCalculator {

    // Trọng số theo yêu cầu
    public static final double W_AREA        = 0.35;
    public static final double W_PERFORMANCE = 0.40;
    public static final double W_WORKLOAD    = 0.25;

    /**
     * Tính tổng điểm staff phù hợp với building (không dùng Score_Building).
     *
     * @param sArea        điểm địa bàn (từ WardLocationScorer)
     * @param sPerformance điểm hiệu suất staff
     * @param sWorkload    điểm tải công việc
     * @param bonus        newbie bonus
     * @return Score_BS
     */
    public static double totalScoreBS(double sArea, double sPerformance, double sWorkload, double bonus) {
        double base = (sArea * W_AREA) + (sPerformance * W_PERFORMANCE) + (sWorkload * W_WORKLOAD);
        return base + bonus;
    }

    public static double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }
}