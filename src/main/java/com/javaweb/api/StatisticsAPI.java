package com.javaweb.api;

import com.javaweb.model.response.StaffRevenueDTO;
import com.javaweb.model.response.StatisticsResponse;
import com.javaweb.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsAPI {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * Dashboard thống kê tổng quan.
     *
     * GET /api/statistics/dashboard
     * GET /api/statistics/dashboard?topN=10
     *
     * Response:
     * {
     *   "totalRevenue": 500000000,
     *   "totalStaffRevenue": 250000000,
     *   "totalSystemRevenue": 250000000,
     *   "totalDeals": 15,
     *   "totalCustomers": 120,
     *   "totalActiveCustomers": 98,
     *   "totalNewCustomers": 30,
     *   "totalPaidCustomers": 15,
     *   "topStaffs": [
     *     {
     *       "rank": 1,
     *       "staffName": "Nguyễn Văn A",
     *       "revenue": 80000000,
     *       "totalDeals": 4,
     *       "performance": 1.0
     *     },
     *     ...
     *   ]
     * }
     */
    @GetMapping("/dashboard")
    public ResponseEntity<StatisticsResponse> getDashboard(
            @RequestParam(defaultValue = "5") int topN) {

        StatisticsResponse response = statisticsService.getDashboardStatistics(topN);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<StaffRevenueDTO> getStaffRevenue(@PathVariable Long staffId) {
        StaffRevenueDTO response = statisticsService.getStaffRevenue(staffId);
        return ResponseEntity.ok(response);
    }
}