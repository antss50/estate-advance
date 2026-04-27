package com.javaweb.enums;

import java.util.Map;
import java.util.TreeMap;

public enum TypeCode {
    // Loại hình văn phòng/căn hộ
    TANG_TRET("Tầng trệt"),
    NGUYEN_CAN("Nguyên căn"),
    NOI_THAT("Nội thất"),

    // Loại building (thêm mới)
    OFFICE("Văn phòng"),
    RETAIL("Mặt bằng kinh doanh"),
    WAREHOUSE("Kho bãi"),
    APARTMENT("Căn hộ");

    private final String typeCodeName;

    TypeCode(String typeCodeName) {
        this.typeCodeName = typeCodeName;
    }

    public String getTypeCodeName() {
        return typeCodeName;
    }

    public static Map<String, String> getTypeCode() {
        Map<String, String> typeCodes = new TreeMap<>();
        for (TypeCode it : TypeCode.values()) {
            typeCodes.put(it.name(), it.typeCodeName);
        }
        return typeCodes;
    }

    // Lấy danh sách loại building (bỏ qua các loại hình nội thất)
    public static Map<String, String> getBuildingTypes() {
        Map<String, String> buildingTypes = new TreeMap<>();
        buildingTypes.put(OFFICE.name(), OFFICE.typeCodeName);
        buildingTypes.put(RETAIL.name(), RETAIL.typeCodeName);
        buildingTypes.put(WAREHOUSE.name(), WAREHOUSE.typeCodeName);
        buildingTypes.put(APARTMENT.name(), APARTMENT.typeCodeName);
        return buildingTypes;
    }
}