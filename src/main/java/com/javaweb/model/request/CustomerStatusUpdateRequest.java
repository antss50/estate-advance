package com.javaweb.model.request;

import com.javaweb.enums.CustomerStatus;
import com.javaweb.enums.TransactionType;

import java.math.BigDecimal;

public class CustomerStatusUpdateRequest {

    // ── Cách 1 (ưu tiên): ID trực tiếp của bảng customer_request ──
    private Long customerRequestId;   // <-- THÊM DÒNG NÀY

    // ── Cách 2 (dự phòng): cặp customerId + demandId ──
    private Long customerId;
    private Long demandId;

    private CustomerStatus newStatus;

    // ── Bắt buộc khi chuyển SIGNED → PAID hoặc ASSIGNED ──
    private Long staffId;
    private Long buildingId;
    private TransactionType transactionType;

    // Nếu SALE
    private BigDecimal contractValue;

    // Nếu RENT
    private BigDecimal monthlyRent;
    private Integer contractMonths;

    // Getters & Setters (bao gồm cả customerRequestId)
    public Long getCustomerRequestId() { return customerRequestId; }
    public void setCustomerRequestId(Long customerRequestId) { this.customerRequestId = customerRequestId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getDemandId() { return demandId; }
    public void setDemandId(Long demandId) { this.demandId = demandId; }

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