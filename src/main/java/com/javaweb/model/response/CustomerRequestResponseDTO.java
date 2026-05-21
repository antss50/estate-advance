package com.javaweb.model.response;

import com.javaweb.model.dto.DemandDTO;

public class CustomerRequestResponseDTO {
    private Long id;
    private Long customerId;
    private String fullName;
    private String phone;
    private String email;
    private DemandDTO demand;
    private String status;
    private String createdDate;
    private String modifiedDate;

    // Constructors
    public CustomerRequestResponseDTO() {}

    public CustomerRequestResponseDTO(Long id, Long customerId, String fullName,
                                      String phone, String email, DemandDTO demand,
                                      String status, String createdDate, String modifiedDate) {
        this.id = id;
        this.customerId = customerId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.demand = demand;
        this.status = status;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

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

    public DemandDTO getDemand() {
        return demand;
    }

    public void setDemand(DemandDTO demand) {
        this.demand = demand;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(String modifiedDate) {
        this.modifiedDate = modifiedDate;
    }
}