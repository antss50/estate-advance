package com.javaweb.entity;

import javax.persistence.*;

@Entity
@Table(name = "customer_request")
public class CustomerRequestEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    // 🔁 THÊM cascade = CascadeType.PERSIST để tự lưu Demand khi lưu CustomerRequest
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "demand_id")
    private DemandEntity demand;

    @Column(name = "status")
    private String status;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CustomerEntity getCustomer() { return customer; }
    public void setCustomer(CustomerEntity customer) { this.customer = customer; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public DemandEntity getDemand() { return demand; }
    public void setDemand(DemandEntity demand) { this.demand = demand; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}