package com.javaweb.model.request;

import com.javaweb.enums.CustomerPriorityType;

public class CustomerMatchingRequest {
    private Long customerId;
    private String transactionType;      // "SALE" hoặc "RENT"
    private Double desiredPriceSale;     // Giá mua mong muốn
    private Double desiredPriceRent;     // Giá thuê mong muốn
    private Double desiredArea;          // Diện tích mong muốn
    private String desiredWard;          // Phường/Xã mong muốn
    private String desiredProvince;      // Tỉnh mong muốn
    private String buildingType;         // Loại nhà
    private CustomerPriorityType priorityType;
    private Double priceTolerance = 0.2;
    private Double areaTolerance = 0.2;
    private Integer limit = 10;

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public Double getDesiredPriceSale() { return desiredPriceSale; }
    public void setDesiredPriceSale(Double desiredPriceSale) { this.desiredPriceSale = desiredPriceSale; }
    public Double getDesiredPriceRent() { return desiredPriceRent; }
    public void setDesiredPriceRent(Double desiredPriceRent) { this.desiredPriceRent = desiredPriceRent; }
    public Double getDesiredArea() { return desiredArea; }
    public void setDesiredArea(Double desiredArea) { this.desiredArea = desiredArea; }
    public String getDesiredWard() { return desiredWard; }
    public void setDesiredWard(String desiredWard) { this.desiredWard = desiredWard; }
    public String getDesiredProvince() { return desiredProvince; }
    public void setDesiredProvince(String desiredProvince) { this.desiredProvince = desiredProvince; }
    public String getBuildingType() { return buildingType; }
    public void setBuildingType(String buildingType) { this.buildingType = buildingType; }
    public CustomerPriorityType getPriorityType() { return priorityType; }
    public void setPriorityType(CustomerPriorityType priorityType) { this.priorityType = priorityType; }
    public Double getPriceTolerance() { return priceTolerance; }
    public void setPriceTolerance(Double priceTolerance) { this.priceTolerance = priceTolerance; }
    public Double getAreaTolerance() { return areaTolerance; }
    public void setAreaTolerance(Double areaTolerance) { this.areaTolerance = areaTolerance; }
    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }
}