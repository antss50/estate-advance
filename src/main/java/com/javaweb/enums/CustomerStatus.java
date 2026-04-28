package com.javaweb.enums;

public enum CustomerStatus {
    NEW("Mới"),
    ASSIGNED("Đã phân công"),
    CONSULTING("Đang tư vấn"),
    SIGNED("Đã ký hợp đồng"),
    PAID("Đã thanh toán");

    private final String name;

    CustomerStatus(String name) {
        this.name = name;
    }

    public String getName() { return name; }
}