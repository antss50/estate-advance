package com.javaweb.entity;

import com.javaweb.enums.CustomerPriorityType;
import javax.persistence.*;

@Entity
@Table(name = "customer_request")
public class CustomerRequestEntity extends BaseEntity {

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Embedded
    private Demand demand;

    @Column(name = "status")
    private String status; // NEW, PROCESSING, DONE

    // ============ THÊM CÁC FIELD MỚI ============
    @Enumerated(EnumType.STRING)
    @Column(name = "customer_priority_type")  // ĐỔI TÊN: priority_type -> customer_priority_type
    private CustomerPriorityType priorityType;

    @Column(name = "customer_transaction_type")  // ĐỔI TÊN: transaction_type -> customer_transaction_type
    private String transactionType;

    @Column(name = "customer_property_type")  // ĐỔI TÊN: property_type -> customer_property_type
    private String propertyType;
    // ============ END ============

    // ===== Getters & Setters =====

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Demand getDemand() {
        return demand;
    }

    public void setDemand(Demand demand) {
        this.demand = demand;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public CustomerPriorityType getPriorityType() {
        return priorityType;
    }

    public void setPriorityType(CustomerPriorityType priorityType) {
        this.priorityType = priorityType;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }
}