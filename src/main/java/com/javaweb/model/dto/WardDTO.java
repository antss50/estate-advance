package com.javaweb.model.dto;

public class WardDTO {
    private String code;
    private String name;
    private String nameSlug;
    private String divisionType;
    private String provinceCode;
    private String provinceName;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameSlug() { return nameSlug; }
    public void setNameSlug(String nameSlug) { this.nameSlug = nameSlug; }
    public String getDivisionType() { return divisionType; }
    public void setDivisionType(String divisionType) { this.divisionType = divisionType; }
    public String getProvinceCode() { return provinceCode; }
    public void setProvinceCode(String provinceCode) { this.provinceCode = provinceCode; }
    public String getProvinceName() { return provinceName; }
    public void setProvinceName(String provinceName) { this.provinceName = provinceName; }
}