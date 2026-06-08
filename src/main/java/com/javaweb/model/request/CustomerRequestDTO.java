package com.javaweb.model.request;

import com.javaweb.enums.CustomerStatus;
import com.javaweb.model.dto.DemandDTO;

public class CustomerRequestDTO {

    private Long id;
    private Long customerId;  // THÊM DÒNG NÀY
    private Long demandId;
    private String fullName;
    private String phone;
    private String email;
    private DemandDTO demand;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getDemandId() { return demandId; }
    public void setDemandId(Long demandId) { this.demandId = demandId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public DemandDTO getDemand() { return demand; }
    public void setDemand(DemandDTO demand) { this.demand = demand; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}