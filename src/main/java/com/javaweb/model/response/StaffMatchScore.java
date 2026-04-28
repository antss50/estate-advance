package com.javaweb.model.response;

public class StaffMatchScore {
    private Long staffId;
    private String staffName;
    private String phone;
    private String workingArea;
    private Double areaScore;
    private Double performanceScore;
    private Double workloadScore;
    private Double newbieBonus;
    private Double totalScore;
    private Integer currentWorkload;
    private Integer totalDeals;
    private Double revenue;
    private Integer daysWorked;

    public StaffMatchScore() {}

    public StaffMatchScore(Long staffId, String staffName, String phone, String workingArea,
                           Double areaScore, Double performanceScore, Double workloadScore,
                           Double newbieBonus, Double totalScore, Integer currentWorkload,
                           Integer totalDeals, Double revenue, Integer daysWorked) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.phone = phone;
        this.workingArea = workingArea;
        this.areaScore = areaScore;
        this.performanceScore = performanceScore;
        this.workloadScore = workloadScore;
        this.newbieBonus = newbieBonus;
        this.totalScore = totalScore;
        this.currentWorkload = currentWorkload;
        this.totalDeals = totalDeals;
        this.revenue = revenue;
        this.daysWorked = daysWorked;
    }

    // Getters and Setters
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getWorkingArea() { return workingArea; }
    public void setWorkingArea(String workingArea) { this.workingArea = workingArea; }
    public Double getAreaScore() { return areaScore; }
    public void setAreaScore(Double areaScore) { this.areaScore = areaScore; }
    public Double getPerformanceScore() { return performanceScore; }
    public void setPerformanceScore(Double performanceScore) { this.performanceScore = performanceScore; }
    public Double getWorkloadScore() { return workloadScore; }
    public void setWorkloadScore(Double workloadScore) { this.workloadScore = workloadScore; }
    public Double getNewbieBonus() { return newbieBonus; }
    public void setNewbieBonus(Double newbieBonus) { this.newbieBonus = newbieBonus; }
    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }
    public Integer getCurrentWorkload() { return currentWorkload; }
    public void setCurrentWorkload(Integer currentWorkload) { this.currentWorkload = currentWorkload; }
    public Integer getTotalDeals() { return totalDeals; }
    public void setTotalDeals(Integer totalDeals) { this.totalDeals = totalDeals; }
    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }
    public Integer getDaysWorked() { return daysWorked; }
    public void setDaysWorked(Integer daysWorked) { this.daysWorked = daysWorked; }
}