package com.javaweb.model.request;

import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.enums.TransactionType;

import com.javaweb.model.dto.DemandDTO;

public class CustomerRequestDTO {

    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private DemandDTO demand;
    private String status;

    // ============ THÊM CÁC TRƯỜNG MỚI ============
    private CustomerPriorityType priorityType;  // DEFAULT, SAVINGS, PROFIT, SPACE
    private TransactionType transactionType;    // SALE, RENT, BOTH
    private CustomerPriorityType propertyType;  // ĐÃ SỬA: DEFAULT, SAVINGS, PROFIT, SPACE
    // ============ END ============

    // Getters and Setters hiện có
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

        // Tự động map từ demand sang các field mới nếu có
        if (demand != null) {
            if (demand.getTransactionType() != null) {
                try {
                    this.transactionType = TransactionType.valueOf(demand.getTransactionType().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Bỏ qua
                }
            }
            if (demand.getBuildingType() != null) {
                try {
                    // ĐÃ SỬA: dùng CustomerPriorityType thay vì PropertyType
                    this.propertyType = CustomerPriorityType.valueOf(demand.getBuildingType().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Bỏ qua
                }
            }
        }
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // ============ GETTERS AND SETTERS MỚI ============
    public CustomerPriorityType getPriorityType() {
        return priorityType;
    }

    public void setPriorityType(CustomerPriorityType priorityType) {
        this.priorityType = priorityType;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public CustomerPriorityType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(CustomerPriorityType propertyType) {
        this.propertyType = propertyType;
    }
    // ============ END ============
}