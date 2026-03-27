package com.javaweb.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "assignmentcustomer")
public class AssignmentCustomerEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staffid", nullable = false)
    private UserEntity staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customerid", nullable = false)  
    private CustomerEntity customer;

    @Column(name = "createddate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "modifieddate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedDate;

    @Column(name = "createdby")
    private String createdBy;

    @Column(name = "modifiedby")
    private String modifiedBy;

    // ===== Getter & Setter =====

    public Long getId() {
        return id;
    }

    public UserEntity getStaff() {
        return staff;
    }

    public void setStaff(UserEntity staff) {
        this.staff = staff;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(Date modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
}