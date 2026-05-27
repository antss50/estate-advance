package com.javaweb.utils;

import com.javaweb.enums.LegalStatus;
import com.javaweb.enums.TransactionType;

/**
 * Chấm điểm độ khó của Building (Building Difficulty Score).
 * Điểm càng cao → Building càng khó chốt → cần staff giỏi hơn.
 *
 * ── Công thức ────────────────────────────────────────────────────────────────
 *
 * 1. Price Score:
 *    Score_Price = min(1.0, Giá / Mức_tối_đa)
 *    - Thuê: mức tối đa = 15 triệu VNĐ/tháng
 *    - Bán:  mức tối đa = 5 tỷ VNĐ
 *
 * 2. Legal Score:
 *    - Có sổ hồng/sổ đỏ  → 0.1  (pháp lý sạch, dễ giao dịch)
 *    - Đang tranh chấp   → 1.0  (rủi ro cao, khó chốt)
 *
 * 3. Liquidity Score:
 *    - Tồn kho ≤ 6 tháng → 0.2  (thanh khoản tốt)
 *    - Tồn kho > 6 tháng → 0.8  (thanh khoản kém, khó bán)
 *
 * 4. Tổng:
 *    Score_Building = (Score_Price × 0.5) + (Score_Legal × 0.4) + (Score_Liquidity × 0.1)
 */
public class BuildingScoreCalculator {

    // ── Mức giá tối đa ────────────────────────────────────────────────────────
    public static final double MAX_RENT_PRICE = 15_000_000.0;   // 15 triệu VNĐ/tháng
    public static final double MAX_SALE_PRICE = 5_000_000_000.0; // 5 tỷ VNĐ

    // ── Trọng số Score_Building ───────────────────────────────────────────────
    public static final double W_PRICE     = 0.5;
    public static final double W_LEGAL     = 0.4;
    public static final double W_LIQUIDITY = 0.1;

    // ── Ngưỡng tồn kho ────────────────────────────────────────────────────────
    private static final int LIQUIDITY_THRESHOLD_MONTHS = 6;

    // ── 1. Score_Price ────────────────────────────────────────────────────────

    /**
     * @param price           Giá thuê (VNĐ/tháng) hoặc giá bán (VNĐ)
     * @param transactionType RENT hoặc SALE
     * @return Score_Price trong [0, 1]
     */
    public static double scorePrice(Double price, TransactionType transactionType) {
        if (price == null || price <= 0) return 0.0;

        double maxPrice = (transactionType == TransactionType.SALE)
                ? MAX_SALE_PRICE
                : MAX_RENT_PRICE;

        return Math.min(1.0, price / maxPrice);
    }

    // ── 2. Score_Legal ────────────────────────────────────────────────────────

    /**
     * @param legal LegalStatus của building
     * @return Score_Legal
     *         CLEAR (sổ hồng/sổ đỏ) → 0.1
     *         DISPUTED (tranh chấp)  → 1.0
     *         Khác / null            → 0.5 (trung lập)
     */
    public static double scoreLegal(LegalStatus legal) {
        if (legal == null) return 0.5;
        switch (legal) {
            case CLEAR:    return 0.1;  // Có sổ hồng/sổ đỏ → pháp lý sạch
            case DISPUTED: return 1.0;  // Đang tranh chấp → rủi ro cao
            default:       return 0.5;
        }
    }

    // ── 3. Score_Liquidity ────────────────────────────────────────────────────

    /**
     * @param monthsInInventory Số tháng building đã tồn kho (chưa được thuê/bán)
     * @return Score_Liquidity
     *         ≤ 6 tháng → 0.2 (thanh khoản tốt)
     *         > 6 tháng → 0.8 (thanh khoản kém)
     */
    public static double scoreLiquidity(int monthsInInventory) {
        return monthsInInventory <= LIQUIDITY_THRESHOLD_MONTHS ? 0.2 : 0.8;
    }

    // ── 4. Score_Building tổng hợp ────────────────────────────────────────────

    /**
     * @param sPrice     Score_Price
     * @param sLegal     Score_Legal
     * @param sLiquidity Score_Liquidity
     * @return Score_Building trong [0, 1]
     */
    public static double totalScore(double sPrice, double sLegal, double sLiquidity) {
        return (sPrice     * W_PRICE)
                + (sLegal     * W_LEGAL)
                + (sLiquidity * W_LIQUIDITY);
    }

    public static double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }
}