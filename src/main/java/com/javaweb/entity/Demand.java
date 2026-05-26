package com.javaweb.entity;

import com.javaweb.enums.CustomerPriorityType;

import javax.persistence.*;

/**
 * Embedded object — các field này ánh xạ thẳng vào bảng "customer".
 * Migration SQL bên dưới (xem migration/V2__add_demand_columns.sql).
 */
@Embeddable
public class Demand {

    @Column(name = "demand_area")
    private Double area;

    @Column(name = "demand_price")
    private Double price;

    @Column(name = "demand_ward")
    private String ward;

    @Column(name = "demand_province")
    private String province;

    @Column(name = "demand_property_type")
    private String propertyType;   // VD: "TANG_TRET" | "NGUYEN_CAN"

    @Enumerated(EnumType.STRING)
    @Column(name = "demand_priority_type")
    private CustomerPriorityType priorityType; // DEFAULT | SAVING | CONVENIENT | SPACIOUS

    @Column(name = "demand_transaction_type")
    private String transactionType; // RENT | SALE

    @Column(name = "demand_number_of_basement")
    private Integer numberOfBasement;

    @Column(name = "demand_direction")
    private String direction;

    @Column(name = "demand_legal_status")
    private String legalStatus;

    @Column(name = "demand_brokerage_fee")
    private Double brokerageFee;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public CustomerPriorityType getPriorityType() { return priorityType; }
    public void setPriorityType(CustomerPriorityType priorityType) { this.priorityType = priorityType; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Integer getNumberOfBasement() { return numberOfBasement; }
    public void setNumberOfBasement(Integer numberOfBasement) { this.numberOfBasement = numberOfBasement; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getLegalStatus() { return legalStatus; }
    public void setLegalStatus(String legalStatus) { this.legalStatus = legalStatus; }

    public Double getBrokerageFee() { return brokerageFee; }
    public void setBrokerageFee(Double brokerageFee) { this.brokerageFee = brokerageFee; }
}