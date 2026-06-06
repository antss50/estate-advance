package com.javaweb.service.impl;

import com.javaweb.entity.UserEntity;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.model.response.StatisticsResponse;
import com.javaweb.model.response.TopStaffResult;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.StatisticsService;
import com.javaweb.utils.StaffMatchingScoreCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private static final double P_TARGET = StaffMatchingScoreCalculator.P_TARGET_DEFAULT;

    @Override
    public StatisticsResponse getDashboardStatistics(int topN) {
        StatisticsResponse stats = new StatisticsResponse();
        List<UserEntity> allStaffs = userRepository.findAll();

        // ── 1. Doanh thu (tính từ sale + rent) ──────────────────────────────
        BigDecimal totalStaffRevenue = allStaffs.stream()
                .map(u -> {
                    BigDecimal sale = u.getRevenueSale() != null ? u.getRevenueSale() : BigDecimal.ZERO;
                    BigDecimal rent = u.getRevenueRent() != null ? u.getRevenueRent() : BigDecimal.ZERO;
                    return sale.add(rent);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tỷ lệ 50/50 → system revenue = staff revenue
        BigDecimal totalSystemRevenue = totalStaffRevenue;
        stats.setTotalRevenue(totalStaffRevenue.add(totalSystemRevenue));
        stats.setTotalStaffRevenue(totalStaffRevenue);
        stats.setTotalSystemRevenue(totalSystemRevenue);

        // ── 2. Deals (tính từ saleDeals + rentDeals) ────────────────────────
        int totalDeals = allStaffs.stream()
                .mapToInt(u -> {
                    int saleDeals = u.getTotalSaleDeals() != null ? u.getTotalSaleDeals() : 0;
                    int rentDeals = u.getTotalRentDeals() != null ? u.getTotalRentDeals() : 0;
                    return saleDeals + rentDeals;
                }).sum();

        int totalSaleDeals = allStaffs.stream()
                .mapToInt(u -> u.getTotalSaleDeals() != null ? u.getTotalSaleDeals() : 0).sum();
        int totalRentDeals = allStaffs.stream()
                .mapToInt(u -> u.getTotalRentDeals() != null ? u.getTotalRentDeals() : 0).sum();

        stats.setTotalDeals(totalDeals);
        stats.setTotalSaleDeals(totalSaleDeals);
        stats.setTotalRentDeals(totalRentDeals);

        // ── 3. Khách hàng ─────────────────────────────────────────────────────
        stats.setTotalCustomers((int) customerRepository.count());
        stats.setTotalActiveCustomers((int) customerRepository.countByIsActive(1));
        stats.setTotalNewCustomers((int) customerRepository.countByStatus(CustomerStatus.NEW));
        stats.setTotalPaidCustomers((int) customerRepository.countByStatus(CustomerStatus.PAID));

        // ── 4. Top nhân viên ──────────────────────────────────────────────────
        stats.setTopStaffs(buildTopStaffs(allStaffs, topN));

        return stats;
    }

    private List<TopStaffResult> buildTopStaffs(List<UserEntity> staffs, int topN) {
        List<TopStaffResult> results = new ArrayList<>();

        for (UserEntity staff : staffs) {
            if (staff.getStatus() == null || staff.getStatus() != 1) continue;

            // Tính tổng doanh thu và tổng deals từ sale + rent
            BigDecimal totalRevenue = (staff.getRevenueSale() != null ? staff.getRevenueSale() : BigDecimal.ZERO)
                    .add(staff.getRevenueRent() != null ? staff.getRevenueRent() : BigDecimal.ZERO);
            int totalDeals = (staff.getTotalSaleDeals() != null ? staff.getTotalSaleDeals() : 0)
                    + (staff.getTotalRentDeals() != null ? staff.getTotalRentDeals() : 0);

            double performance = StaffMatchingScoreCalculator.scorePerformance(totalRevenue, totalDeals, P_TARGET);

            // Tự động cập nhật performance vào DB (có thể giữ lại hoặc bỏ nếu không cần thiết)
            staff.setPerformance(round(performance));

            TopStaffResult result = new TopStaffResult();
            result.setStaffId(staff.getId());
            result.setStaffName(staff.getFullName());
            result.setEmail(staff.getEmail());
            result.setPhone(staff.getPhone());
            result.setRevenue(totalRevenue);
            result.setRevenueSale(staff.getRevenueSale() != null ? staff.getRevenueSale() : BigDecimal.ZERO);
            result.setRevenueRent(staff.getRevenueRent() != null ? staff.getRevenueRent() : BigDecimal.ZERO);
            result.setTotalDeals(totalDeals);
            result.setTotalSaleDeals(staff.getTotalSaleDeals() != null ? staff.getTotalSaleDeals() : 0);
            result.setTotalRentDeals(staff.getTotalRentDeals() != null ? staff.getTotalRentDeals() : 0);
            result.setPerformance(round(performance));
            results.add(result);
        }

        results.sort(Comparator.comparingDouble(TopStaffResult::getPerformance).reversed());
        for (int i = 0; i < results.size(); i++) results.get(i).setRank(i + 1);
        return results.stream().limit(topN).collect(Collectors.toList());
    }

    private double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }
}