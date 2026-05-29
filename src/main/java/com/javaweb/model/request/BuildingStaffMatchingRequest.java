package com.javaweb.model.request;

/**
 * Request tìm staff phù hợp nhất để phụ trách một building.
 *
 * Flow:
 *   1. Tính Score_Building (độ khó: Price, Legal, Liquidity)
 *   2. Với mỗi staff: tính S_Area (địa bàn), S_Performance, S_Workload
 *   3. Score_BS = (Score_Building × S_Area × 0.4) + (S_Perf × 0.25) + (S_Work × 0.35) + Bonus
 *   4. Sắp xếp giảm dần → trả về top N
 */
public class BuildingStaffMatchingRequest {

    // ── Bắt buộc ─────────────────────────────────────────────────────────────
    private Long buildingId;            // Building cần tìm staff phụ trách

    // ── Thông tin tồn kho (dùng để tính Score_Liquidity) ─────────────────────
    private int  monthsInInventory = 0; // Số tháng building chưa được thuê/bán

    // ── Cấu hình (tuỳ chọn, có default) ─────────────────────────────────────
    private double pTarget       = 200_000_000.0; // Doanh thu kỳ vọng/deal (VNĐ)
    private int    lMax          = 10;             // Số khách tối đa mỗi staff
    private int    probationDays = 60;             // Số ngày thử việc
    private int    topN          = 5;              // Số kết quả trả về

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public int getMonthsInInventory() { return monthsInInventory; }
    public void setMonthsInInventory(int monthsInInventory) { this.monthsInInventory = monthsInInventory; }

    public double getPTarget() { return pTarget; }
    public void setPTarget(double pTarget) { this.pTarget = pTarget; }

    public int getLMax() { return lMax; }
    public void setLMax(int lMax) { this.lMax = lMax; }

    public int getProbationDays() { return probationDays; }
    public void setProbationDays(int probationDays) { this.probationDays = probationDays; }

    public int getTopN() { return topN; }
    public void setTopN(int topN) { this.topN = topN; }
}