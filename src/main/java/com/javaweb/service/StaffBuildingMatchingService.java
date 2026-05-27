//package com.javaweb.service;
//
//import com.javaweb.config.commission.CommissionConfig;
//import com.javaweb.entity.BuildingEntity;
//import com.javaweb.entity.UserEntity;
//import com.javaweb.model.response.StaffMatchScore;
//import com.javaweb.repository.BuildingRepository;
//import com.javaweb.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class StaffBuildingMatchingService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private BuildingRepository buildingRepository;
//
//    @Autowired
//    private CommissionConfig commissionConfig;
//
//    // Map các phường/xã lân cận (trong cùng quận cũ)
//    private static final Map<String, List<String>> NEIGHBORING_WARDS = new HashMap<>();
//
//    static {
//        // ============ TP HỒ CHÍ MINH - Quận 1 ============
//        NEIGHBORING_WARDS.put("Phường Bến Nghé", Arrays.asList("Phường Bến Thành", "Phường Cầu Kho", "Phường Đa Kao"));
//        NEIGHBORING_WARDS.put("Phường Bến Thành", Arrays.asList("Phường Bến Nghé", "Phường Cầu Kho", "Phường Tân Định"));
//        NEIGHBORING_WARDS.put("Phường Cầu Kho", Arrays.asList("Phường Bến Nghé", "Phường Bến Thành"));
//
//        // ============ TP HỒ CHÍ MINH - Quận 2 ============
//        NEIGHBORING_WARDS.put("Phường An Phú", Arrays.asList("Phường Bình An", "Phường An Khánh"));
//        NEIGHBORING_WARDS.put("Phường Bình An", Arrays.asList("Phường An Phú", "Phường An Khánh"));
//
//        // ============ HÀ NỘI - Quận Ba Đình ============
//        NEIGHBORING_WARDS.put("Phường Phúc Xá", Arrays.asList("Phường Trúc Bạch", "Phường Vĩnh Phúc"));
//        NEIGHBORING_WARDS.put("Phường Trúc Bạch", Arrays.asList("Phường Phúc Xá", "Phường Cống Vị"));
//
//        // ============ HÀ NỘI - Quận Hoàn Kiếm ============
//        NEIGHBORING_WARDS.put("Phường Hàng Mã", Arrays.asList("Phường Đồng Xuân", "Phường Hàng Buồm"));
//        NEIGHBORING_WARDS.put("Phường Hàng Bạc", Arrays.asList("Phường Hàng Đào", "Phường Hàng Trống"));
//    }
//
//    /**
//     * Tìm staff phù hợp cho building
//     * Công thức: Score = (S_performance × 0.4) + (S_workload × 0.25) + (S_area × 0.35)
//     */
//    public List<StaffMatchScore> findBestStaffForBuilding(Long buildingId, int limit) {
//        BuildingEntity building = buildingRepository.findById(buildingId)
//                .orElseThrow(() -> new RuntimeException("Building not found"));
//
//        List<UserEntity> allStaff = userRepository.findStaffs("STAFF");
//
//        if (allStaff == null || allStaff.isEmpty()) {
//            return new ArrayList<>();
//        }
//
//        return allStaff.stream()
//                .distinct()
//                .map(staff -> calculateMatchScore(staff, building))
//                .sorted((s1, s2) -> Double.compare(s2.getTotalScore(), s1.getTotalScore()))
//                .limit(limit)
//                .collect(Collectors.toList());
//    }
//
//    private StaffMatchScore calculateMatchScore(UserEntity staff, BuildingEntity building) {
//        // 1. Tính điểm khu vực (S_area) - dựa trên Xã/Phường
//        double areaScore = calculateAreaScore(staff, building);
//
//        // 2. Tính điểm hiệu suất (S_performance)
//        double performanceScore = calculatePerformanceScore(staff);
//
//        // 3. Tính điểm workload (S_workload)
//        double workloadScore = calculateWorkloadScore(staff);
//
//        // 4. Tính điểm cơ bản
//        double baseScore = (performanceScore * 0.4) + (workloadScore * 0.25) + (areaScore * 0.35);
//
//        // 5. Tính Newbie Bonus
//        double newbieBonus = calculateNewbieBonus(staff);
//
//        // 6. Tổng điểm
//        double totalScore = baseScore + newbieBonus;
//
//        int currentWorkload = staff.getAssignmentBuildings() != null ?
//                staff.getAssignmentBuildings().size() : 0;
//        int daysWorked = getDaysWorked(staff);
//        Integer totalDeals = staff.getTotalDeals() != null ? staff.getTotalDeals() : 0;
//        Double revenue = staff.getRevenue() != null ? staff.getRevenue().doubleValue() : 0.0;
//        Double avgRevenuePerDeal = (totalDeals > 0) ? (revenue / totalDeals) : 0.0;
//
//        return new StaffMatchScore(
//                staff.getId(),
//                staff.getFullName(),
//                staff.getPhone(),
//                staff.getWorkingArea(),
//                areaScore,
//                performanceScore,
//                workloadScore,
//                newbieBonus,
//                Math.min(totalScore, 1.0),
//                currentWorkload,
//                totalDeals,
//                revenue,
//                daysWorked,
//                avgRevenuePerDeal
//        );
//    }
//
//    /**
//     * Tính điểm khu vực (S_area)
//     * Sau sáp nhập 2025: Chỉ còn cấp Xã/Phường
//     *
//     * Cùng phường/xã: 1.0
//     * Phường/xã lân cận: 0.6
//     * Khác xa: 0.2
//     */
//    private double calculateAreaScore(UserEntity staff, BuildingEntity building) {
//        String workingArea = staff.getWorkingArea();
//        String buildingWard = building.getWardName();  // Lấy tên phường/xã của building
//
//        if (workingArea == null || workingArea.isEmpty() || buildingWard == null || buildingWard.isEmpty()) {
//            return 0.5;
//        }
//
//        List<String> staffWards = Arrays.asList(workingArea.split(","));
//
//        // Cùng phường/xã
//        for (String ward : staffWards) {
//            if (ward.trim().equalsIgnoreCase(buildingWard)) {
//                return 1.0;
//            }
//        }
//
//        // Phường/xã lân cận
//        for (String ward : staffWards) {
//            if (isNeighboringWard(ward.trim(), buildingWard)) {
//                return 0.6;
//            }
//        }
//
//        return 0.2;
//    }
//
//    private boolean isNeighboringWard(String ward1, String ward2) {
//        List<String> neighbors = NEIGHBORING_WARDS.get(ward1);
//        if (neighbors != null) {
//            return neighbors.stream().anyMatch(n -> n.equalsIgnoreCase(ward2));
//        }
//        return false;
//    }
//
//    private double calculatePerformanceScore(UserEntity staff) {
//        Double revenue = staff.getRevenue() != null ? staff.getRevenue().doubleValue() : 0.0;
//        Integer totalDeals = staff.getTotalDeals() != null ? staff.getTotalDeals() : 0;
//        double targetPerDeal = commissionConfig.getRevenueTargetPerDeal();
//
//        if (totalDeals == null || totalDeals == 0 || targetPerDeal <= 0) {
//            return 0.0;
//        }
//
//        double expectedRevenue = totalDeals * targetPerDeal;
//        double score = revenue / expectedRevenue;
//
//        return Math.min(1.0, Math.max(0, score));
//    }
//
//    private double calculateWorkloadScore(UserEntity staff) {
//        int currentWorkload = staff.getAssignmentBuildings() != null ?
//                staff.getAssignmentBuildings().size() : 0;
//        int maxWorkload = commissionConfig.getMaxWorkload();
//
//        if (maxWorkload <= 0) return 0.5;
//        double score = 1.0 - ((double) currentWorkload / maxWorkload);
//        return Math.max(0, Math.min(1.0, score));
//    }
//
//    private double calculateNewbieBonus(UserEntity staff) {
//        int daysWorked = getDaysWorked(staff);
//        int probationDays = commissionConfig.getProbationDays();
//        double boost = commissionConfig.getNewbieBonusBoost();
//
//        if (daysWorked >= probationDays) return 0.0;
//        double decayFactor = Math.max(0, 1.0 - (double) daysWorked / probationDays);
//        return boost * decayFactor;
//    }
//
//    private int getDaysWorked(UserEntity staff) {
//        try {
//            if (staff.getCreatedDate() == null) return 0;
//            long createdTime = staff.getCreatedDate().getTime();
//            long currentTime = System.currentTimeMillis();
//            long diffInMillies = currentTime - createdTime;
//            long days = diffInMillies / (1000 * 60 * 60 * 24);
//            return (int) days;
//        } catch (Exception e) {
//            return 0;
//        }
//    }
//}