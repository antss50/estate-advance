package com.javaweb.model.response;

/**
 * Kết quả matching của một staff với khách hàng.
 */
public class StaffMatchingResult {

    private Long   staffId;
    private String staffName;
    private String email;
    private String phone;
    private String workingArea;

    // ── Chi tiết điểm từng thành phần ────────────────────────────────────────
    private double scoreArea;       // S_Area: khu vực staff vs ward khách    // Điểm nhu cầu khách (đầu vào)
    private double scorePerformance; // S_Performance
    private double scoreWorkload;    // S_Workload
    private double newbieBonus;      // Bonus nhân viên mới (0 nếu không áp dụng)
    private double totalScoreCS;     // Score_CS tổng hợp

    // ── Thông tin bổ sung ─────────────────────────────────────────────────────
    private int     currentLoad;     // Số khách đang phụ trách
    private boolean isNewbie;        // Có đang trong thời gian thử việc không
    private int     daysWorked;      // Số ngày đã đi làm

    // ── Getters & Setters ─────────────────────────────────────────────────────

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

    public double getScoreArea() { return scoreArea; }
    public void setScoreArea(double scoreArea) { this.scoreArea = scoreArea; }

    public double getScorePerformance() { return scorePerformance; }
    public void setScorePerformance(double scorePerformance) { this.scorePerformance = scorePerformance; }

    public double getScoreWorkload() { return scoreWorkload; }
    public void setScoreWorkload(double scoreWorkload) { this.scoreWorkload = scoreWorkload; }

    public double getNewbieBonus() { return newbieBonus; }
    public void setNewbieBonus(double newbieBonus) { this.newbieBonus = newbieBonus; }

    public double getTotalScoreCS() { return totalScoreCS; }
    public void setTotalScoreCS(double totalScoreCS) { this.totalScoreCS = totalScoreCS; }

    public int getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(int currentLoad) { this.currentLoad = currentLoad; }

    public boolean isNewbie() { return isNewbie; }
    public void setNewbie(boolean newbie) { isNewbie = newbie; }

    public int getDaysWorked() { return daysWorked; }
    public void setDaysWorked(int daysWorked) { this.daysWorked = daysWorked; }
}