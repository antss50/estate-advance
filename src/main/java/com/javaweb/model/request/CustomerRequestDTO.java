package com.javaweb.model.request;

public class CustomerRequestDTO {

    private String fullName;
    private String phone;
    private String email;
    private String demand;

    // ===== CONSTRUCTOR =====
    public CustomerRequestDTO() {
    }

    public CustomerRequestDTO(String fullName, String phone, String email, String demand) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.demand = demand;
    }

    // ===== GETTER & SETTER =====

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

    public String getDemand() {
        return demand;
    }

    public void setDemand(String demand) {
        this.demand = demand;
    }
}