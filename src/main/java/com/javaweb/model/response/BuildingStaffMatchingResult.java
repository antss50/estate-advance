package com.javaweb.model.response;

/**
 * Kết quả matching của một staff với building.
 */
public class BuildingStaffMatchingResult {

    private Long   staffId;
    private String staffName;
    private String email;
    private String phone;
    private String workingArea;

    // ── Chi tiết điểm building ────────────────────────────────────────────────
    private double scoreBuilding;    // Độ khó tổng hợp của building
    private double scoreBuildingPrice;
    private double scoreBuildingLegal;
    private double scoreBuildingLiquidity;

    // ── Chi tiết điểm staff ───────────────────────────────────────────────────
    private double scoreArea;        // Địa bàn staff vs vị trí building
    private double scorePerformance; // Hiệu suất chốt sale
    private double scoreWorkload;    // Khối lượng công việc hiện tại
    private double newbieBonus;      // Bonus nhân viên mới

    // ── Tổng điểm ────────────────────────────────────────────────────────────
    private double totalScoreBS;     // Score_BS tổng hợp

    // ── Thông tin bổ sung ─────────────────────────────────────────────────────
    private int     currentLoad;
    private boolean isNewbie;
    private int     daysWorked;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWorkingArea() { return workingArea; }
    public void setWorkingArea(String workingArea) { this.workingArea = workingArea; }

    public double getScoreBuilding() { return scoreBuilding; }
    public void setScoreBuilding(double scoreBuilding) { this.scoreBuilding = scoreBuilding; }

    public double getScoreBuildingPrice() { return scoreBuildingPrice; }
    public void setScoreBuildingPrice(double scoreBuildingPrice) { this.scoreBuildingPrice = scoreBuildingPrice; }

    public double getScoreBuildingLegal() { return scoreBuildingLegal; }
    public void setScoreBuildingLegal(double scoreBuildingLegal) { this.scoreBuildingLegal = scoreBuildingLegal; }

    public double getScoreBuildingLiquidity() { return scoreBuildingLiquidity; }
    public void setScoreBuildingLiquidity(double scoreBuildingLiquidity) { this.scoreBuildingLiquidity = scoreBuildingLiquidity; }

    public double getScoreArea() { return scoreArea; }
    public void setScoreArea(double scoreArea) { this.scoreArea = scoreArea; }

    public double getScorePerformance() { return scorePerformance; }
    public void setScorePerformance(double scorePerformance) { this.scorePerformance = scorePerformance; }

    public double getScoreWorkload() { return scoreWorkload; }
    public void setScoreWorkload(double scoreWorkload) { this.scoreWorkload = scoreWorkload; }

    public double getNewbieBonus() { return newbieBonus; }
    public void setNewbieBonus(double newbieBonus) { this.newbieBonus = newbieBonus; }

    public double getTotalScoreBS() { return totalScoreBS; }
    public void setTotalScoreBS(double totalScoreBS) { this.totalScoreBS = totalScoreBS; }

    public int getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(int currentLoad) { this.currentLoad = currentLoad; }

    public boolean isNewbie() { return isNewbie; }
    public void setNewbie(boolean newbie) { isNewbie = newbie; }

    public int getDaysWorked() { return daysWorked; }
    public void setDaysWorked(int daysWorked) { this.daysWorked = daysWorked; }
}