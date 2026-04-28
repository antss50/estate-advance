package com.javaweb.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "commission")
public class CommissionConfig {

    // ============ MUA BÁN ============
    private double saleTotalRate = 0.02;      // 2% tổng hoa hồng
    private double saleStaffRate = 0.01;      // 1% staff nhận (50%)
    private double saleSystemRate = 0.01;     // 1% hệ thống (50%)

    // ============ CHO THUÊ ============
    private double rentStaffPercentage = 0.5;  // Tỷ lệ staff nhận (50%, có thể config 60%, 70%)
    private int rentLongTermMonths = 12;       // >= 12 tháng
    private int rentShortTermMonths = 6;       // < 12 tháng

    // ============ CHẤM ĐIỂM ============
    private double revenueTarget = 200000000;   // 200 triệu VND
    private int maxWorkload = 5;                // Số building tối đa staff có thể quản lý

    // ============ NEWBIE BONUS ============
    private double newbieBonusBoost = 0.3;      // Hệ số ưu tiên
    private int probationDays = 90;             // Số ngày thử việc

    // Getters and Setters
    public double getSaleTotalRate() { return saleTotalRate; }
    public void setSaleTotalRate(double saleTotalRate) { this.saleTotalRate = saleTotalRate; }

    public double getSaleStaffRate() { return saleStaffRate; }
    public void setSaleStaffRate(double saleStaffRate) { this.saleStaffRate = saleStaffRate; }

    public double getSaleSystemRate() { return saleSystemRate; }
    public void setSaleSystemRate(double saleSystemRate) { this.saleSystemRate = saleSystemRate; }

    public double getRentStaffPercentage() { return rentStaffPercentage; }
    public void setRentStaffPercentage(double rentStaffPercentage) { this.rentStaffPercentage = rentStaffPercentage; }

    public int getRentLongTermMonths() { return rentLongTermMonths; }
    public void setRentLongTermMonths(int rentLongTermMonths) { this.rentLongTermMonths = rentLongTermMonths; }

    public int getRentShortTermMonths() { return rentShortTermMonths; }
    public void setRentShortTermMonths(int rentShortTermMonths) { this.rentShortTermMonths = rentShortTermMonths; }

    public double getRevenueTarget() { return revenueTarget; }
    public void setRevenueTarget(double revenueTarget) { this.revenueTarget = revenueTarget; }

    public int getMaxWorkload() { return maxWorkload; }
    public void setMaxWorkload(int maxWorkload) { this.maxWorkload = maxWorkload; }

    public double getNewbieBonusBoost() { return newbieBonusBoost; }
    public void setNewbieBonusBoost(double newbieBonusBoost) { this.newbieBonusBoost = newbieBonusBoost; }

    public int getProbationDays() { return probationDays; }
    public void setProbationDays(int probationDays) { this.probationDays = probationDays; }
}