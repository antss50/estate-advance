package com.javaweb.model.dto;

public class ProvinceDTO {
    private String code;
    private String name;
    private String nameSlug;
    private String divisionType;

    public ProvinceDTO() {}

    public ProvinceDTO(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameSlug() { return nameSlug; }
    public void setNameSlug(String nameSlug) { this.nameSlug = nameSlug; }
    public String getDivisionType() { return divisionType; }
    public void setDivisionType(String divisionType) { this.divisionType = divisionType; }
}