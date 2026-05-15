package com.javaweb.model.dto;

import com.javaweb.enums.CustomerPriorityType;

public class DemandDTO {
    private Double area;           // Diện tích mong muốn
    private Double price;          // Giá mong muốn (mua hoặc thuê)
    private String ward;           // Phường/Xã mong muốn (thay vì location)
    private String province;       // Tỉnh/Thành phố mong muốn

    // Loại hình
    private String buildingType;   // Loại building: OFFICE, RETAIL, WAREHOUSE, APARTMENT
    private String transactionType; // SALE, RENT, BOTH
    private String propertyType;   // OFFICE, RETAIL, WAREHOUSE, APARTMENT

    // Thông tin bổ sung
    private Integer numberOfBasement;
    private String direction;
    private String legalStatus;
    private Double brokerageFee;
    private CustomerPriorityType priorityType;

    public DemandDTO() {}

    // Getters and Setters
    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getBuildingType() { return buildingType; }
    public void setBuildingType(String buildingType) { this.buildingType = buildingType; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public Integer getNumberOfBasement() { return numberOfBasement; }
    public void setNumberOfBasement(Integer numberOfBasement) { this.numberOfBasement = numberOfBasement; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getLegalStatus() { return legalStatus; }
    public void setLegalStatus(String legalStatus) { this.legalStatus = legalStatus; }

    public Double getBrokerageFee() { return brokerageFee; }
    public void setBrokerageFee(Double brokerageFee) { this.brokerageFee = brokerageFee; }

    public CustomerPriorityType getPriorityType() { return priorityType; }
    public void setPriorityType(CustomerPriorityType priorityType) { this.priorityType = priorityType; }
}