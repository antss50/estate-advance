package com.javaweb.enums;

public enum PropertyType {
    OFFICE("Văn phòng"),
    RETAIL("Mặt bằng kinh doanh"),
    WAREHOUSE("Kho bãi"),
    APARTMENT("Căn hộ"),
    OTHER("Khác");

    private final String value;

    PropertyType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static PropertyType fromValue(String value) {
        if (value == null) {
            return OTHER;
        }
        for (PropertyType type : PropertyType.values()) {
            if (type.value.equalsIgnoreCase(value) || type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        return OTHER;
    }
}