package com.javaweb.utils;

/**
 * Matching Building ↔ Staff — công thức tính điểm thuần túy.
 *
 * Tái sử dụng cấu trúc Customer ↔ Staff:
 *   Score_BS = (Score_Building × 0.4) + (S_Performance × 0.25) + (S_Workload × 0.35)
 *            + NewbieBonus
 *
 * S_Area (workingArea staff vs wardCode building) được tính bởi WardLocationScorer
 * và truyền vào qua tham số sArea — dùng để nhân vào trọng số W_BUILDING thay thế
 * (building khó + staff đúng khu vực → ưu tiên cao hơn).
 *
 * Công thức thực tế:
 *   Score_BS = (Score_Building × S_Area × 0.4) + (S_Performance × 0.25) + (S_Workload × 0.35)
 *
 * Ý nghĩa: Building khó (score cao) nhưng staff không đúng khu vực (S_Area thấp)
 * → điểm Building bị giảm xuống → ưu tiên staff đúng địa bàn hơn.
 */
public class BuildingStaffScoreCalculator {

    public static final double W_BUILDING    = 0.40;
    public static final double W_PERFORMANCE = 0.25;
    public static final double W_WORKLOAD    = 0.35;

    /**
     * Tổng điểm matching Building ↔ Staff.
     *
     * @param scoreBuilding  Độ khó của building (từ BuildingScoreCalculator)
     * @param sArea          Điểm khu vực staff vs building (từ WardLocationScorer)
     *                       → nhân trực tiếp vào scoreBuilding để giảm điểm khi sai địa bàn
     * @param sPerformance   Hiệu suất chốt sale của staff
     * @param sWorkload      Khối lượng công việc hiện tại của staff
     * @param bonus          Newbie bonus (0 nếu không áp dụng)
     * @return Score_BS
     */
    public static double totalScoreBS(
            double scoreBuilding,
            double sArea,
            double sPerformance,
            double sWorkload,
            double bonus) {

        // S_Area điều chỉnh trọng số building theo địa bàn
        // VD: building score=0.8, staff sai địa bàn sArea=0.2 → 0.8×0.2=0.16 thay vì 0.8
        double base = (scoreBuilding * sArea * W_BUILDING)
                + (sPerformance  * W_PERFORMANCE)
                + (sWorkload     * W_WORKLOAD);

        return base + bonus;
    }

    public static double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }
}