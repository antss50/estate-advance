package com.javaweb.model.request;

public class  StaffMatchingRequest {

    // ── Bắt buộc ─────────────────────────────────────────────────────────────
    private Long   customerId;

    // ── Cấu hình (tuỳ chọn, có default) ─────────────────────────────────────
    private double pTarget       = 200_000_000.0;
    private int    lMax          = 10;
    private int    probationDays = 60;
    private int    topN          = 5;

    // Ward code của khách → dùng để tính S_Area cho staff
    private String demandWardCode;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getPTarget() { return pTarget; }
    public void setPTarget(double pTarget) { this.pTarget = pTarget; }

    public int getLMax() { return lMax; }
    public void setLMax(int lMax) { this.lMax = lMax; }

    public int getProbationDays() { return probationDays; }
    public void setProbationDays(int probationDays) { this.probationDays = probationDays; }

    public int getTopN() { return topN; }
    public void setTopN(int topN) { this.topN = topN; }

    public String getDemandWardCode() { return demandWardCode; }
    public void setDemandWardCode(String demandWardCode) { this.demandWardCode = demandWardCode; }
}