package com.javaweb.enums;

public enum LegalStatus {
    SO_HONG("Sổ hồng"),
    SO_DO("Sổ đỏ"),
    KHONG_SO("Không sổ");

    private String value;

    LegalStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}