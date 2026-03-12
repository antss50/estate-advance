package com.javaweb.enums;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public enum TypeCode {
    TANG_TRET("Tầng trệt"),
    NGUYEN_CAN("Nguyên căn"),
    NOI_THAT("Nội thất"),
    NHA_CHO("Nhà chồ");

    private final String typeCodeName;
    TypeCode(String typeCodeName) {
        this.typeCodeName = typeCodeName;
    }

    public static Map<String,String> getTypeCode(){
        Map<String,String> typeCodes = new TreeMap<>();
        for(TypeCode it : TypeCode.values()){
            typeCodes.put(it.toString(), it.typeCodeName);
        }
        return typeCodes;
    }

    }
