package com.javaweb.enums;

public enum TransactionType {
    SALE("Mua bán"),
    RENT("Cho thuê"),
    BOTH("Cả hai");

    private final String name;

    TransactionType(String name) {
        this.name = name;
    }
    public String getName() { return name; }
}