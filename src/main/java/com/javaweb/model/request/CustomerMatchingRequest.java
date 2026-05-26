package com.javaweb.model.request;

/**
 * Request tìm building phù hợp.
 *
 * Vì khách đã có tài khoản, chỉ cần gửi customerId.
 * Toàn bộ demand (area, price, ward, priorityType...) sẽ được
 * load từ CustomerEntity.demand trong DB.
 *
 * Các field override là tuỳ chọn — dùng khi muốn thử matching
 * với thông số khác mà không thay đổi dữ liệu trong DB.
 */
public class CustomerMatchingRequest {

    // ── Bắt buộc ─────────────────────────────────────────────────────────────
    private Long customerId;

    // ── Tuỳ chọn: override demand từ DB (nếu null → dùng giá trị trong DB) ──
    private Double overrideArea;
    private Double overridePrice;
    private String overrideWard;
    private String overrideProvince;
    private String overridePropertyType;

    // ── Cấu hình kết quả ─────────────────────────────────────────────────────
    private double minScore = 0.0; // Chỉ trả về building có score ≥ minScore
    private int    topN     = 10;  // Số kết quả tối đa (sắp xếp giảm dần)

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Double getOverrideArea() { return overrideArea; }
    public void setOverrideArea(Double overrideArea) { this.overrideArea = overrideArea; }

    public Double getOverridePrice() { return overridePrice; }
    public void setOverridePrice(Double overridePrice) { this.overridePrice = overridePrice; }

    public String getOverrideWard() { return overrideWard; }
    public void setOverrideWard(String overrideWard) { this.overrideWard = overrideWard; }

    public String getOverrideProvince() { return overrideProvince; }
    public void setOverrideProvince(String overrideProvince) { this.overrideProvince = overrideProvince; }

    public String getOverridePropertyType() { return overridePropertyType; }
    public void setOverridePropertyType(String overridePropertyType) { this.overridePropertyType = overridePropertyType; }

    public double getMinScore() { return minScore; }
    public void setMinScore(double minScore) { this.minScore = minScore; }

    public int getTopN() { return topN; }
    public void setTopN(int topN) { this.topN = topN; }
}