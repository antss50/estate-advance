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

    // Map các phường/xã lân cận (trong cùng quận cũ)
    private static final Map<String, List<String>> NEIGHBORING_WARDS = new HashMap<>();

    static {
        // ============ TP HỒ CHÍ MINH - Quận 1 ============
        NEIGHBORING_WARDS.put("Phường Bến Nghé", Arrays.asList(
                "Phường Bến Thành", "Phường Cầu Kho", "Phường Đa Kao", "Phường Tân Định"
        ));
        NEIGHBORING_WARDS.put("Phường Đa Kao", Arrays.asList(
                "Phường Bến Nghé", "Phường Tân Định"
        ));
        NEIGHBORING_WARDS.put("Phường Tân Định", Arrays.asList(
                "Phường Bến Nghé", "Phường Đa Kao", "Phường Bến Thành"
        ));
        NEIGHBORING_WARDS.put("Phường Bến Thành", Arrays.asList(
                "Phường Bến Nghé", "Phường Cầu Kho", "Phường Tân Định"
        ));
        NEIGHBORING_WARDS.put("Phường Cầu Kho", Arrays.asList(
                "Phường Bến Nghé", "Phường Bến Thành"
        ));

        // ============ TP HỒ CHÍ MINH - Quận 2 ============
        NEIGHBORING_WARDS.put("Phường An Phú", Arrays.asList("Phường Bình An", "Phường An Khánh"));
        NEIGHBORING_WARDS.put("Phường Bình An", Arrays.asList("Phường An Phú", "Phường An Khánh"));
        NEIGHBORING_WARDS.put("Phường An Khánh", Arrays.asList("Phường An Phú", "Phường Bình An"));

        // ============ TP HỒ CHÍ MINH - Quận 3 ============
        NEIGHBORING_WARDS.put("Phường Võ Thị Sáu", Arrays.asList("Phường 4", "Phường 5", "Phường 9"));
        NEIGHBORING_WARDS.put("Phường 4", Arrays.asList("Phường Võ Thị Sáu", "Phường 5"));
        NEIGHBORING_WARDS.put("Phường 5", Arrays.asList("Phường Võ Thị Sáu", "Phường 4"));

        // ============ HÀ NỘI - Quận Ba Đình ============
        NEIGHBORING_WARDS.put("Phường Phúc Xá", Arrays.asList("Phường Trúc Bạch", "Phường Vĩnh Phúc"));
        NEIGHBORING_WARDS.put("Phường Trúc Bạch", Arrays.asList("Phường Phúc Xá", "Phường Cống Vị"));
        NEIGHBORING_WARDS.put("Phường Vĩnh Phúc", Arrays.asList("Phường Phúc Xá", "Phường Cống Vị"));
        NEIGHBORING_WARDS.put("Phường Cống Vị", Arrays.asList("Phường Trúc Bạch", "Phường Vĩnh Phúc", "Phường Liễu Giai"));
        NEIGHBORING_WARDS.put("Phường Liễu Giai", Arrays.asList("Phường Cống Vị", "Phường Ngọc Khánh"));

        // ============ HÀ NỘI - Quận Hoàn Kiếm ============
        NEIGHBORING_WARDS.put("Phường Hàng Mã", Arrays.asList("Phường Đồng Xuân", "Phường Hàng Buồm"));
        NEIGHBORING_WARDS.put("Phường Đồng Xuân", Arrays.asList("Phường Hàng Mã", "Phường Hàng Buồm"));
        NEIGHBORING_WARDS.put("Phường Hàng Buồm", Arrays.asList("Phường Hàng Mã", "Phường Đồng Xuân"));
        NEIGHBORING_WARDS.put("Phường Hàng Bạc", Arrays.asList("Phường Hàng Đào", "Phường Hàng Trống"));
        NEIGHBORING_WARDS.put("Phường Hàng Đào", Arrays.asList("Phường Hàng Bạc", "Phường Hàng Trống"));
        NEIGHBORING_WARDS.put("Phường Hàng Trống", Arrays.asList("Phường Hàng Bạc", "Phường Hàng Đào"));

        // ============ HÀ NỘI - Quận Đống Đa ============
        NEIGHBORING_WARDS.put("Phường Quốc Tử Giám", Arrays.asList("Phường Văn Miếu", "Phường Nam Đồng"));
        NEIGHBORING_WARDS.put("Phường Văn Miếu", Arrays.asList("Phường Quốc Tử Giám", "Phường Nam Đồng"));
        NEIGHBORING_WARDS.put("Phường Nam Đồng", Arrays.asList("Phường Quốc Tử Giám", "Phường Văn Miếu"));
    }

    /**
     * Tìm staff phù hợp cho customer dựa trên phường/xã mong muốn
     */
    public List<StaffMatchScore> findBestStaffForCustomer(String desiredWard, int limit) {
        List<UserEntity> allStaff = userRepository.findStaffs("STAFF");

        if (allStaff == null || allStaff.isEmpty()) {
            return new ArrayList<>();
        }

        return allStaff.stream()
                .distinct()
                .map(staff -> calculateMatchScore(staff, desiredWard))
                .filter(score -> score.getAreaScore() > 0)  // Chỉ lấy staff có khu vực phù hợp
                .sorted((s1, s2) -> Double.compare(s2.getTotalScore(), s1.getTotalScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Tính điểm match cho 1 staff
     */
    private StaffMatchScore calculateMatchScore(UserEntity staff, String desiredWard) {
        // 1. Tính điểm khu vực (S_area)
        double areaScore = calculateAreaScore(staff, desiredWard);

        // Nếu areaScore = 0, không cần tính tiếp
        if (areaScore == 0.0) {
            return createEmptyScore(staff, areaScore);
        }

        // 2. Tính điểm hiệu suất (S_performance)
        double performanceScore = calculatePerformanceScore(staff);

        // 3. Tính điểm workload (S_workload)
        double workloadScore = calculateWorkloadScore(staff);

        // 4. Tính điểm cơ bản
        double baseScore = (performanceScore * 0.4) + (workloadScore * 0.25) + (areaScore * 0.35);

        // 5. Tính Newbie Bonus
        double newbieBonus = calculateNewbieBonus(staff);

        // 6. Tổng điểm
        double totalScore = baseScore + newbieBonus;

        // Lấy thông tin bổ sung
        int currentWorkload = staff.getAssignmentBuildings() != null ?
                staff.getAssignmentBuildings().size() : 0;
        int daysWorked = getDaysWorked(staff);
        Integer totalDeals = staff.getTotalDeals() != null ? staff.getTotalDeals() : 0;
        Double revenue = staff.getRevenue() != null ? staff.getRevenue().doubleValue() : 0.0;
        Double avgRevenuePerDeal = (totalDeals > 0) ? (revenue / totalDeals) : 0.0;

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
                totalDeals,
                revenue,
                daysWorked,
                avgRevenuePerDeal
        );
    }

    /**
     * Tạo StaffMatchScore rỗng (khi areaScore = 0)
     */
    private StaffMatchScore createEmptyScore(UserEntity staff, double areaScore) {
        return new StaffMatchScore(
                staff.getId(),
                staff.getFullName(),
                staff.getPhone(),
                staff.getWorkingArea(),
                areaScore,
                0.0,
                0.0,
                0.0,
                0.0,
                0,
                0,
                0.0,
                0,
                0.0
        );
    }

    /**
     * Tính điểm khu vực (S_area)
     *
     * QUAN TRỌNG:
     * - Nếu staff không có workingArea (null hoặc rỗng) -> trả về 0 (không đề xuất)
     * - Nếu customer không yêu cầu phường -> trả về 1.0 (tất cả đều được)
     * - Cùng phường: 1.0
     * - Phường lân cận: 0.6
     * - Khác xa: 0.2
     */
    private double calculateAreaScore(UserEntity staff, String desiredWard) {
        String workingArea = staff.getWorkingArea();

        // TRƯỜNG HỢP 1: Staff không có khu vực làm việc -> KHÔNG đề xuất
        if (workingArea == null || workingArea.trim().isEmpty()) {
            return 0.0;
        }

        // TRƯỜNG HỢP 2: Customer không yêu cầu phường cụ thể -> tất cả đều được
        if (desiredWard == null || desiredWard.trim().isEmpty()) {
            return 1.0;
        }

        List<String> staffWards = Arrays.asList(workingArea.split(","));

        // TRƯỜNG HỢP 3: Cùng phường/xã
        for (String ward : staffWards) {
            if (ward.trim().equalsIgnoreCase(desiredWard)) {
                return 1.0;
            }
        }

        // TRƯỜNG HỢP 4: Phường/xã lân cận
        for (String ward : staffWards) {
            if (isNeighboringWard(ward.trim(), desiredWard)) {
                return 0.6;
            }
        }

        // TRƯỜNG HỢP 5: Khác xa
        return 0.2;
    }

    /**
     * Kiểm tra phường/xã có phải lân cận không
     */
    private boolean isNeighboringWard(String ward1, String ward2) {
        List<String> neighbors = NEIGHBORING_WARDS.get(ward1);
        if (neighbors != null) {
            return neighbors.stream().anyMatch(n -> n.equalsIgnoreCase(ward2));
        }
        return false;
    }

    /**
     * Tính điểm hiệu suất (S_performance)
     * Công thức: S_performance = min(1.0, Doanh thu / (Số đơn hàng thành công × P_target))
     */
    private double calculatePerformanceScore(UserEntity staff) {
        Double revenue = staff.getRevenue() != null ? staff.getRevenue().doubleValue() : 0.0;
        Integer totalDeals = staff.getTotalDeals() != null ? staff.getTotalDeals() : 0;
        double targetPerDeal = commissionConfig.getRevenueTargetPerDeal();

        if (totalDeals == null || totalDeals == 0 || targetPerDeal <= 0) {
            return 0.0;
        }

        double expectedRevenue = totalDeals * targetPerDeal;
        double score = revenue / expectedRevenue;

        return Math.min(1.0, Math.max(0, score));
    }

    /**
     * Tính điểm workload (S_workload)
     * Công thức: S_workload = 1 - (L_current / L_max)
     */
    private double calculateWorkloadScore(UserEntity staff) {
        int currentWorkload = staff.getAssignmentBuildings() != null ?
                staff.getAssignmentBuildings().size() : 0;
        int maxWorkload = commissionConfig.getMaxWorkload();

        if (maxWorkload <= 0) {
            return 0.5;
        }

        double score = 1.0 - ((double) currentWorkload / maxWorkload);
        return Math.max(0, Math.min(1.0, score));
    }

    /**
     * Tính Newbie Bonus cho nhân viên mới
     * Công thức: Bonus = Score_boost × max(0, 1 - t/T)
     */
    private double calculateNewbieBonus(UserEntity staff) {
        int daysWorked = getDaysWorked(staff);
        int probationDays = commissionConfig.getProbationDays();
        double boost = commissionConfig.getNewbieBonusBoost();

        if (daysWorked >= probationDays) {
            return 0.0;
        }

        double decayFactor = Math.max(0, 1.0 - (double) daysWorked / probationDays);
        return boost * decayFactor;
    }

    /**
     * Lấy số ngày đã làm việc của staff
     */
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