package com.javaweb.model.response;

import java.math.BigDecimal;

public class CustomerStatusUpdateResponse {

    private Long    customerId;
    private String  oldStatus;
    private String  newStatus;
    private boolean success;

    // ── Chỉ có giá trị khi SIGNED → PAID ─────────────────────────────────────
    private BigDecimal totalCommission;
    private BigDecimal staffCommission;
    private BigDecimal systemCommission;
    private String     commissionDescription;

    // ── Trạng thái Building sau giao dịch ────────────────────────────────────
    private Long   buildingId;
    private String buildingStatus; // RENTED hoặc SOLD

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public BigDecimal getTotalCommission() { return totalCommission; }
    public void setTotalCommission(BigDecimal totalCommission) { this.totalCommission = totalCommission; }

    public BigDecimal getStaffCommission() { return staffCommission; }
    public void setStaffCommission(BigDecimal staffCommission) { this.staffCommission = staffCommission; }

    public BigDecimal getSystemCommission() { return systemCommission; }
    public void setSystemCommission(BigDecimal systemCommission) { this.systemCommission = systemCommission; }

    public String getCommissionDescription() { return commissionDescription; }
    public void setCommissionDescription(String commissionDescription) { this.commissionDescription = commissionDescription; }

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getBuildingStatus() { return buildingStatus; }
    public void setBuildingStatus(String buildingStatus) { this.buildingStatus = buildingStatus; }
}