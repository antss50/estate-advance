package com.javaweb.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommissionDTO {
    private Long customerId;
    private Long staffId;
    private Long buildingId;
    private String transactionType;
    private BigDecimal contractValue;
    private Integer rentMonths;
    private BigDecimal totalCommission;
    private BigDecimal staffCommission;
    private BigDecimal systemCommission;
    private LocalDateTime paidDate;
    private String customerStatus;

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getContractValue() { return contractValue; }
    public void setContractValue(BigDecimal contractValue) { this.contractValue = contractValue; }
    public Integer getRentMonths() { return rentMonths; }
    public void setRentMonths(Integer rentMonths) { this.rentMonths = rentMonths; }
    public BigDecimal getTotalCommission() { return totalCommission; }
    public void setTotalCommission(BigDecimal totalCommission) { this.totalCommission = totalCommission; }
    public BigDecimal getStaffCommission() { return staffCommission; }
    public void setStaffCommission(BigDecimal staffCommission) { this.staffCommission = staffCommission; }
    public BigDecimal getSystemCommission() { return systemCommission; }
    public void setSystemCommission(BigDecimal systemCommission) { this.systemCommission = systemCommission; }
    public LocalDateTime getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDateTime paidDate) { this.paidDate = paidDate; }
    public String getCustomerStatus() { return customerStatus; }
    public void setCustomerStatus(String customerStatus) { this.customerStatus = customerStatus; }
}