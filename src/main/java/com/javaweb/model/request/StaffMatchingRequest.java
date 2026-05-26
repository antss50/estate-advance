package com.javaweb.model.request;

/**
 * Request tìm staff phù hợp nhất cho một khách hàng.
 *
 * Flow:
 *   1. Tính Score_Customer (đã có từ CustomerBuildingMatchingService)
 *   2. Với mỗi staff: tính S_Performance, S_Workload, Newbie Bonus
 *   3. Tổng hợp → Score_CS → sắp xếp → trả về top N staff
 */
public class StaffMatchingRequest {

    // ── Bắt buộc ─────────────────────────────────────────────────────────────
    private Long   customerId;      // ID khách hàng cần assign
    private double scoreCustomer;   // Điểm matching khách-building (đã tính trước)

    // ── Cấu hình (tuỳ chọn, có default) ─────────────────────────────────────
    private double pTarget       = 200_000_000.0; // Doanh thu kỳ vọng/deal (VNĐ)
    private int    lMax          = 10;             // Số khách tối đa mỗi staff
    private int    probationDays = 60;             // Số ngày thử việc (T)
    private int    topN          = 5;              // Số kết quả trả về

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getScoreCustomer() { return scoreCustomer; }
    public void setScoreCustomer(double scoreCustomer) { this.scoreCustomer = scoreCustomer; }

    public double getPTarget() { return pTarget; }
    public void setPTarget(double pTarget) { this.pTarget = pTarget; }

    public int getLMax() { return lMax; }
    public void setLMax(int lMax) { this.lMax = lMax; }

    public int getProbationDays() { return probationDays; }
    public void setProbationDays(int probationDays) { this.probationDays = probationDays; }

    public int getTopN() { return topN; }
    public void setTopN(int topN) { this.topN = topN; }
}