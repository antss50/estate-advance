package com.javaweb.enums;

/**
 * Trạng thái của Building.
 *
 * AVAILABLE  → Sẵn sàng cho thuê / bán
 * RENTED     → Đã cho thuê (tự động set khi SIGNED → PAID với transactionType = RENT)
 * SOLD       → Đã bán      (tự động set khi SIGNED → PAID với transactionType = SALE)
 */
public enum BuildingStatus {
    AVAILABLE,
    RENTED,
    SOLD
}