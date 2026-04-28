package com.javaweb.service;

import com.javaweb.config.CommissionConfig;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.response.StaffMatchScore;
import com.javaweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StaffCustomerMatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommissionConfig commissionConfig;

    // Map các quận lân cận
    private static final Map<String, List<String>> NEIGHBORING_DISTRICTS = new HashMap<>();

    static {
        // TP HCM
        NEIGHBORING_DISTRICTS.put("Quận 1", Arrays.asList("Quận 3", "Quận 4", "Quận 5", "Quận Bình Thạnh"));
        NEIGHBORING_DISTRICTS.put("Quận 2", Arrays.asList("Quận 9", "Thủ Đức", "Quận 7"));
        NEIGHBORING_DISTRICTS.put("Quận 3", Arrays.asList("Quận 1", "Quận 4", "Quận 5", "Quận 10"));
        NEIGHBORING_DISTRICTS.put("Quận 4", Arrays.asList("Quận 1", "Quận 3", "Quận 7"));
        NEIGHBORING_DISTRICTS.put("Quận 5", Arrays.asList("Quận 1", "Quận 3", "Quận 6", "Quận 10", "Quận 11"));
        NEIGHBORING_DISTRICTS.put("Quận 10", Arrays.asList("Quận 3", "Quận 5", "Quận 11", "Quận Tân Bình"));
        NEIGHBORING_DISTRICTS.put("Quận 11", Arrays.asList("Quận 5", "Quận 6", "Quận 10", "Quận Tân Bình"));
        NEIGHBORING_DISTRICTS.put("Bình Thạnh", Arrays.asList("Quận 1", "Quận 3", "Quận Phú Nhuận"));

        // Hà Nội
        NEIGHBORING_DISTRICTS.put("Quận Ba Đình", Arrays.asList("Quận Hoàn Kiếm", "Quận Đống Đa", "Quận Tây Hồ"));
        NEIGHBORING_DISTRICTS.put("Quận Hoàn Kiếm", Arrays.asList("Quận Ba Đình", "Quận Đống Đa", "Quận Hai Bà Trưng"));
        NEIGHBORING_DISTRICTS.put("Quận Đống Đa", Arrays.asList("Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Hai Bà Trưng", "Quận Thanh Xuân"));
        NEIGHBORING_DISTRICTS.put("Quận Hai Bà Trưng", Arrays.asList("Quận Hoàn Kiếm", "Quận Đống Đa", "Quận Thanh Xuân"));
        NEIGHBORING_DISTRICTS.put("Quận Thanh Xuân", Arrays.asList("Quận Đống Đa", "Quận Hai Bà Trưng", "Quận Cầu Giấy"));
        NEIGHBORING_DISTRICTS.put("Quận Cầu Giấy", Arrays.asList("Quận Thanh Xuân", "Quận Đống Đa", "Quận Nam Từ Liêm"));
    }

    /**
     * Tìm staff phù hợp cho customer
     * Công thức: S_CS = (S_performance × 0.4) + (S_workload × 0.25) + (S_area × 0.35)
     */
    public List<StaffMatchScore> findBestStaffForCustomer(String desiredDistrict, int limit) {
        List<UserEntity> allStaff = userRepository.findStaffs("STAFF");

        if (allStaff == null || allStaff.isEmpty()) {
            return new ArrayList<>();
        }

        return allStaff.stream()
                .map(staff -> calculateMatchScore(staff, desiredDistrict))
                .sorted((s1, s2) -> Double.compare(s2.getTotalScore(), s1.getTotalScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private StaffMatchScore calculateMatchScore(UserEntity staff, String desiredDistrict) {
        double areaScore = calculateAreaScore(staff, desiredDistrict);
        double performanceScore = calculatePerformanceScore(staff);
        double workloadScore = calculateWorkloadScore(staff);

        double baseScore = (performanceScore * 0.4) + (workloadScore * 0.25) + (areaScore * 0.35);
        double newbieBonus = calculateNewbieBonus(staff);
        double totalScore = baseScore + newbieBonus;

        int currentWorkload = staff.getAssignmentBuildings() != null ?
                staff.getAssignmentBuildings().size() : 0;
        int daysWorked = getDaysWorked(staff);

        return new StaffMatchScore(
                staff.getId(),
                staff.getFullName(),
                staff.getPhone(),
                staff.getWorkingArea(),
                areaScore,
                performanceScore,
                workloadScore,
                newbieBonus,
                Math.min(totalScore, 1.0),
                currentWorkload,
                staff.getTotalDeals() != null ? staff.getTotalDeals() : 0,
                staff.getRevenue() != null ? staff.getRevenue().doubleValue() : 0.0,
                daysWorked
        );
    }

    private double calculateAreaScore(UserEntity staff, String desiredDistrict) {
        String workingArea = staff.getWorkingArea();

        if (workingArea == null || workingArea.isEmpty() || desiredDistrict == null || desiredDistrict.isEmpty()) {
            return 0.5;
        }

        List<String> staffAreas = Arrays.asList(workingArea.split(","));

        for (String area : staffAreas) {
            if (area.trim().equalsIgnoreCase(desiredDistrict)) {
                return 1.0;
            }
        }

        for (String area : staffAreas) {
            List<String> neighbors = NEIGHBORING_DISTRICTS.get(area.trim());
            if (neighbors != null && neighbors.contains(desiredDistrict)) {
                return 0.6;
            }
        }

        return 0.2;
    }

    private double calculatePerformanceScore(UserEntity staff) {
        Double revenue = staff.getRevenue() != null ? staff.getRevenue().doubleValue() : 0.0;
        double target = commissionConfig.getRevenueTarget();

        if (target <= 0) return 0.5;
        double score = Math.min(1.0, revenue / target);
        return Math.max(0, score);
    }

    private double calculateWorkloadScore(UserEntity staff) {
        int currentWorkload = staff.getAssignmentBuildings() != null ?
                staff.getAssignmentBuildings().size() : 0;
        int maxWorkload = commissionConfig.getMaxWorkload();

        if (maxWorkload <= 0) return 0.5;
        double score = 1.0 - ((double) currentWorkload / maxWorkload);
        return Math.max(0, Math.min(1.0, score));
    }

    private double calculateNewbieBonus(UserEntity staff) {
        int daysWorked = getDaysWorked(staff);
        int probationDays = commissionConfig.getProbationDays();
        double boost = commissionConfig.getNewbieBonusBoost();

        if (daysWorked >= probationDays) return 0.0;
        double decayFactor = Math.max(0, 1.0 - (double) daysWorked / probationDays);
        return boost * decayFactor;
    }

    private int getDaysWorked(UserEntity staff) {
        try {
            if (staff.getCreatedDate() == null) return 0;
            long createdTime = staff.getCreatedDate().getTime();
            long currentTime = System.currentTimeMillis();
            long diffInMillies = currentTime - createdTime;
            long days = diffInMillies / (1000 * 60 * 60 * 24);
            return (int) days;
        } catch (Exception e) {
            return 0;
        }
    }
}