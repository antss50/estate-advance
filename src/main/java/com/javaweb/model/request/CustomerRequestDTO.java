package com.javaweb.model.request;

import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.enums.TransactionType;
import com.javaweb.enums.TypeCode;
import com.javaweb.model.dto.DemandDTO;

public class CustomerRequestDTO {

    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private DemandDTO demand;
    private String status;

    private CustomerPriorityType priorityType;
    private TransactionType transactionType;
    private TypeCode propertyType;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public DemandDTO getDemand() { return demand; }

    public void setDemand(DemandDTO demand) {
        this.demand = demand;

        if (demand != null) {
            // Map priorityType
            if (demand.getPriorityType() != null) {
                this.priorityType = demand.getPriorityType();
            }

            // Map transactionType
            if (demand.getTransactionType() != null) {
                try {
                    this.transactionType = TransactionType.valueOf(demand.getTransactionType().toUpperCase());
                } catch (IllegalArgumentException e) {}
            }

            // Map propertyType
            String propertyTypeValue = demand.getPropertyType();
            if (propertyTypeValue == null) {
                propertyTypeValue = demand.getBuildingType();
            }
            if (propertyTypeValue != null) {
                try {
                    this.propertyType = TypeCode.valueOf(propertyTypeValue.toUpperCase());
                } catch (IllegalArgumentException e) {}
            }
        }
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public CustomerPriorityType getPriorityType() { return priorityType; }
    public void setPriorityType(CustomerPriorityType priorityType) { this.priorityType = priorityType; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public TypeCode getPropertyType() { return propertyType; }
    public void setPropertyType(TypeCode propertyType) { this.propertyType = propertyType; }
}