package com.javaweb.entity;

import com.javaweb.enums.CustomerStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "customer")
public class CustomerEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "fullname", nullable = false)
    private String fullName;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "companyname")
    private String companyName;

    // ── THAY THẾ: Một customer có nhiều demand ────────────────────────────────
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DemandEntity> demands = new ArrayList<>();
    // ─────────────────────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CustomerStatus status = CustomerStatus.NEW;

    @Column(name = "is_active")
    private Integer isActive = 1;

    @Column(name = "last_login")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLogin;

    // ── Getters & Setters (giữ nguyên, thay demand -> demands) ──────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public List<DemandEntity> getDemands() { return demands; }
    public void setDemands(List<DemandEntity> demands) { this.demands = demands; }

    public CustomerStatus getStatus() { return status; }
    public void setStatus(CustomerStatus status) { this.status = status; }

    public Integer getIsActive() { return isActive; }
    public void setIsActive(Integer isActive) { this.isActive = isActive; }

    public Date getLastLogin() { return lastLogin; }
    public void setLastLogin(Date lastLogin) { this.lastLogin = lastLogin; }

    // ── Tiện ích: thêm demand, lấy demand mặc định, ... ──────────────────────
    public void addDemand(DemandEntity demand) {
        demands.add(demand);
        demand.setCustomer(this);
    }

    public void removeDemand(DemandEntity demand) {
        demands.remove(demand);
        demand.setCustomer(null);
    }

    // Nếu muốn giữ khái niệm "nhu cầu hiện tại" (ví dụ lấy cái đầu tiên)
    public DemandEntity getCurrentDemand() {
        return demands.isEmpty() ? null : demands.get(0);
    }
}