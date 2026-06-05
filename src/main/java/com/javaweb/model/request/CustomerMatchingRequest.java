package com.javaweb.model.request;

import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.enums.PropertyType;

/**
 * Request gửi lên để tìm building phù hợp với nhu cầu của khách.
 */
public class CustomerMatchingRequest {

    private Long customerId;          // (tuỳ chọn) nếu muốn lấy demand từ DB

    // ── Thông tin nhu cầu (override hoặc dùng trực tiếp) ────────────────────
    private Double demandArea;        // Diện tích mong muốn (m²)
    private Double demandPrice;       // Giá mong muốn (triệu/m² hoặc tỷ)
    private String demandWard;        // Ward_name
    private String demandProvince;    // Province_name
    private PropertyType demandPropertyType;  // ĐÃ SỬA: từ String thành Enum

    private CustomerPriorityType priorityType; // Loại ưu tiên → chọn bộ trọng số

    private double minScore = 0.0;    // Lọc kết quả: chỉ trả về building có score ≥ minScore
    private int    topN     = 10;     // Trả về tối đa N kết quả (sắp xếp giảm dần theo score)

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Double getDemandArea() { return demandArea; }
    public void setDemandArea(Double demandArea) { this.demandArea = demandArea; }

    public Double getDemandPrice() { return demandPrice; }
    public void setDemandPrice(Double demandPrice) { this.demandPrice = demandPrice; }

    public String getDemandWard() { return demandWard; }
    public void setDemandWard(String demandWard) { this.demandWard = demandWard; }

    public String getDemandProvince() { return demandProvince; }
    public void setDemandProvince(String demandProvince) { this.demandProvince = demandProvince; }

    public PropertyType getDemandPropertyType() { return demandPropertyType; }
    public void setDemandPropertyType(PropertyType demandPropertyType) { this.demandPropertyType = demandPropertyType; }

    public CustomerPriorityType getPriorityType() { return priorityType; }
    public void setPriorityType(CustomerPriorityType priorityType) { this.priorityType = priorityType; }

    public double getMinScore() { return minScore; }
    public void setMinScore(double minScore) { this.minScore = minScore; }

    public int getTopN() { return topN; }
    public void setTopN(int topN) { this.topN = topN; }
}