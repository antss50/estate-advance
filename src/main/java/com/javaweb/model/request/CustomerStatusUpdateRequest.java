package com.javaweb.model.request;

import com.javaweb.enums.CustomerStatus;
import com.javaweb.enums.TransactionType;

import java.math.BigDecimal;

/**
 * Request cập nhật trạng thái khách hàng.
 *
 * Khi chuyển SIGNED → PAID, bắt buộc phải cung cấp:
 *   - staffId
 *   - buildingId       → hệ thống tự động đổi trạng thái building AVAILABLE → RENTED/SOLD
 *   - transactionType  (SALE hoặc RENT)
 *   - Nếu SALE: contractValue
 *   - Nếu RENT: monthlyRent + contractMonths
 */
public class CustomerStatusUpdateRequest {

    // ── Bắt buộc ─────────────────────────────────────────────────────────────
    private Long           customerId;
    private CustomerStatus newStatus;

    // ── Bắt buộc khi SIGNED → PAID ───────────────────────────────────────────
    private Long            staffId;
    private Long            buildingId;    // Building liên quan → tự động đổi AVAILABLE → RENTED/SOLD
    private TransactionType transactionType;

    // Nếu SALE
    private BigDecimal contractValue;

    // Nếu RENT
    private BigDecimal monthlyRent;
    private Integer    contractMonths;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public CustomerStatus getNewStatus() { return newStatus; }
    public void setNewStatus(CustomerStatus newStatus) { this.newStatus = newStatus; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public BigDecimal getContractValue() { return contractValue; }
    public void setContractValue(BigDecimal contractValue) { this.contractValue = contractValue; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public Integer getContractMonths() { return contractMonths; }
    public void setContractMonths(Integer contractMonths) { this.contractMonths = contractMonths; }
}