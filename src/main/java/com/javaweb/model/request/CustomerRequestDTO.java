package com.javaweb.model.request;

import com.javaweb.model.dto.DemandDTO;

public class CustomerRequestDTO {

    private String fullName;
    private String phone;
    private String email;
    private DemandDTO demand;

    public CustomerRequestDTO() {}

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
}