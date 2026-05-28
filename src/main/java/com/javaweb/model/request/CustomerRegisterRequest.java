package com.javaweb.model.request;

import com.javaweb.entity.DemandEntity;

public class CustomerRegisterRequest {

    private String username;
    private String password;
    private String fullName;
    private String phone;
    private String email;
    private String companyName;

    // Demand là @Entity riêng — Jackson tự deserialize JSON object → Demand
    private DemandEntity demand;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public DemandEntity getDemand() { return demand; }
    public void setDemand(DemandEntity demand) { this.demand = demand; }
}