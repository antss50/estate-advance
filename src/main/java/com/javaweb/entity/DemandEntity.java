package com.javaweb.entity;

import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.enums.PropertyType;

import javax.persistence.*;

@Entity
@Table(name = "demand")
public class DemandEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Khóa ngoại trỏ đến Customer
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    // Các cột dữ liệu (bỏ tiền tố "demand_" vì đã ở trong bảng demand)
    @Column(name = "area")
    private Double area;

    @Column(name = "price")
    private Double price;

    @Column(name = "ward")
    private String ward;

    @Column(name = "province")
    private String province;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type")
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_type")
    private CustomerPriorityType priorityType;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "number_of_basement")
    private Integer numberOfBasement;

    @Column(name = "direction")
    private String direction;

    @Column(name = "legal_status")
    private String legalStatus;

    @Column(name = "brokerage_fee")
    private Double brokerageFee;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CustomerEntity getCustomer() { return customer; }
    public void setCustomer(CustomerEntity customer) { this.customer = customer; }

    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

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