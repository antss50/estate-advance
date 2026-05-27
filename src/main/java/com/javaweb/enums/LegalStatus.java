package com.javaweb.enums;

/**
 * Trạng thái pháp lý của Building.
 *
 * Dùng trong BuildingScoreCalculator.scoreLegal():
 *   CLEAR    → 0.1  (Có sổ hồng/sổ đỏ, pháp lý sạch)
 *   DISPUTED → 1.0  (Đang tranh chấp, rủi ro cao)
 *   PENDING  → 0.5  (Đang chờ cấp sổ, trung lập)
 */
public enum LegalStatus {
    CLEAR,    // Có sổ hồng / sổ đỏ
    DISPUTED, // Đang tranh chấp
    PENDING   // Đang làm thủ tục (mặc định trung lập)
}