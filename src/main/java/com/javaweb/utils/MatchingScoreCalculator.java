package com.javaweb.utils;

/**
 * Engine tính điểm matching theo công thức:
 *
 *   Si = max(0, 1 - |Value_building - Value_demand| / Tolerance)
 *
 * Tolerance:
 *   - Giá  : 20% của giá demand
 *   - Diện tích: 20 m²
 *
 * Score = Σ(Wi × Si) / ΣWi
 */
public class MatchingScoreCalculator {

    // ── Tolerance constants ─────────────────────────────────────────────────
    private static final double PRICE_TOLERANCE_PERCENT = 0.20; // 20%
    private static final double AREA_TOLERANCE_M2       = 20.0; // 20 m²

    // ── Score cho Location ──────────────────────────────────────────────────
    private static final double SCORE_SAME_WARD      = 1.0;
    private static final double SCORE_ADJACENT       = 0.6;
    private static final double SCORE_FAR            = 0.2;

    // ── Score cho Type ──────────────────────────────────────────────────────
    private static final double SCORE_SAME_TYPE      = 1.0;
    private static final double SCORE_DIFF_TYPE      = 0.0;

    /**
     * Tính Si cho Price.
     *
     * @param buildingPrice giá building (priceRent hoặc priceSale)
     * @param demandPrice   giá mong muốn của khách
     * @return Si trong [0, 1]
     */
    public static double scorePrince(Double buildingPrice, Double demandPrice) {
        if (demandPrice == null || demandPrice == 0) return 1.0; // không có yêu cầu → khớp hoàn toàn
        if (buildingPrice == null) return 0.0;

        double tolerance = demandPrice * PRICE_TOLERANCE_PERCENT;
        return Math.max(0.0, 1.0 - Math.abs(buildingPrice - demandPrice) / tolerance);
    }

    /**
     * Tính Si cho Area.
     *
     * @param buildingArea diện tích building (floorArea)
     * @param demandArea   diện tích mong muốn của khách
     * @return Si trong [0, 1]
     */
    public static double scoreArea(Double buildingArea, Double demandArea) {
        if (demandArea == null || demandArea == 0) return 1.0;
        if (buildingArea == null) return 0.0;

        return Math.max(0.0, 1.0 - Math.abs(buildingArea - demandArea) / AREA_TOLERANCE_M2);
    }

    /**
     * Tính SL cho Location (ward/province).
     *
     * Quy tắc:
     *  - Cùng ward (wardCode hoặc wardName)  → 1.0
     *  - Cùng province nhưng khác ward       → 0.6 (coi là "lân cận")
     *  - Khác province                        → 0.2
     *
     * @param buildingWardCode   wardCode của building
     * @param buildingProvinceCode provinceCode của building
     * @param demandWard         ward yêu cầu của khách (code hoặc name)
     * @param demandProvince     province yêu cầu của khách (code hoặc name)
     */
    public static double scoreLocation(
            String buildingWardCode, String buildingWardName,
            String buildingProvinceCode, String buildingProvinceName,
            String demandWard, String demandProvince) {

        // Nếu khách không có yêu cầu location → khớp hoàn toàn
        if (isBlank(demandWard) && isBlank(demandProvince)) return SCORE_SAME_WARD;

        boolean sameWard = !isBlank(demandWard)
                && (demandWard.equalsIgnoreCase(buildingWardCode)
                || demandWard.equalsIgnoreCase(buildingWardName));

        boolean sameProvince = !isBlank(demandProvince)
                && (demandProvince.equalsIgnoreCase(buildingProvinceCode)
                || demandProvince.equalsIgnoreCase(buildingProvinceName));

        if (sameWard)     return SCORE_SAME_WARD;
        if (sameProvince) return SCORE_ADJACENT;
        return SCORE_FAR;
    }

    /**
     * Tính ST cho Type (propertyType).
     *
     * Building.propertyType là CSV: "TANG_TRET,NGUYEN_CAN"
     * Demand.propertyType là một giá trị: "TANG_TRET"
     *
     * Nếu building hỗ trợ type của demand → 1.0, ngược lại → 0.0
     */
    public static double scoreType(String buildingPropertyType, String demandPropertyType) {
        if (isBlank(demandPropertyType)) return SCORE_SAME_TYPE; // không yêu cầu → khớp
        if (isBlank(buildingPropertyType)) return SCORE_DIFF_TYPE;

        String[] types = buildingPropertyType.split(",");
        for (String t : types) {
            if (t.trim().equalsIgnoreCase(demandPropertyType.trim())) {
                return SCORE_SAME_TYPE;
            }
        }
        return SCORE_DIFF_TYPE;
    }

    /**
     * Tính tổng điểm matching theo công thức:
     *   Score = Σ(Wi × Si) / ΣWi
     *
     * @param weight   bộ trọng số theo priority type
     * @param sLocation điểm vị trí
     * @param sPrice    điểm giá
     * @param sArea     điểm diện tích
     * @param sType     điểm loại nhà (nếu type không khớp → loại thẳng, trả về 0)
     */
    public static double totalScore(
            MatchingWeight weight,
            double sLocation, double sPrice, double sArea, double sType) {

        // Type là điều kiện bắt buộc (hard filter): nếu không khớp → score = 0
        if (sType == SCORE_DIFF_TYPE) return 0.0;

        double sumW  = weight.wLocation + weight.wPrice + weight.wArea;
        double sumWS = weight.wLocation * sLocation
                + weight.wPrice    * sPrice
                + weight.wArea     * sArea;

        return sumW > 0 ? sumWS / sumW : 0.0;
    }

    // ── Helper ──────────────────────────────────────────────────────────────
    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}