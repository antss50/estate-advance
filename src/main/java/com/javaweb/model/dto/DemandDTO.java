package com.javaweb.model.dto;

import com.javaweb.enums.CustomerPriorityType;

public class DemandDTO {
    private Long id;   // ← THÊM DÒNG NÀY
    private Double area;
    private Double price;
    private String ward;
    private String province;
    private String transactionType;
    private String propertyType;
    private CustomerPriorityType priorityType;
    private Integer numberOfBasement;
    private String direction;
    private String legalStatus;
    private Double brokerageFee;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public CustomerPriorityType getPriorityType() { return priorityType; }
    public void setPriorityType(CustomerPriorityType priorityType) { this.priorityType = priorityType; }

    public Integer getNumberOfBasement() { return numberOfBasement; }
    public void setNumberOfBasement(Integer numberOfBasement) { this.numberOfBasement = numberOfBasement; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getLegalStatus() { return legalStatus; }
    public void setLegalStatus(String legalStatus) { this.legalStatus = legalStatus; }

    public Double getBrokerageFee() { return brokerageFee; }
    public void setBrokerageFee(Double brokerageFee) { this.brokerageFee = brokerageFee; }
}