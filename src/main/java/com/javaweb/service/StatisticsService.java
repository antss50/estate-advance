package com.javaweb.service;

import com.javaweb.model.response.StatisticsResponse;

public interface StatisticsService {

    /**
     * Tổng hợp số liệu dashboard:
     * - Doanh thu tổng (staff + hệ thống)
     * - Số deals thành công
     * - Tổng khách hàng
     * - Top nhân viên xuất sắc theo performance
     *
     * @param topN số lượng nhân viên xuất sắc cần lấy (mặc định 5)
     */
    StatisticsResponse getDashboardStatistics(int topN);
}