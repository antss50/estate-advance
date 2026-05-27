package com.javaweb.scheduler;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.enums.BuildingStatus;
import com.javaweb.repository.BuildingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduled Job: tự động kiểm tra building hết hạn thuê mỗi ngày lúc 00:00.
 *
 * Điều kiện hết hạn:
 *   buildingStatus = RENTED  AND  rentEndDate <= ngày hôm nay
 *
 * Hành động:
 *   → buildingStatus  = AVAILABLE  (sẵn sàng cho thuê lại)
 *   → rentStartDate   = null
 *   → rentEndDate     = null
 *
 * Kích hoạt: thêm @EnableScheduling vào class @SpringBootApplication của bạn.
 */
@Component
public class BuildingRentExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(BuildingRentExpiryScheduler.class);

    @Autowired
    private BuildingRepository buildingRepository;

    /**
     * Chạy mỗi ngày lúc 00:00:00.
     * Cron: "0 0 0 * * *"  =  giây phút giờ ngày tháng thứ
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void releaseExpiredRentals() {
        LocalDate today = LocalDate.now();

        // Lấy tất cả building đang RENTED và đã hết hạn
        List<BuildingEntity> expired = buildingRepository
                .findByBuildingStatusAndRentEndDateLessThanEqual(BuildingStatus.RENTED, today);

        if (expired.isEmpty()) {
            log.info("[RentExpiry] {} | Không có building nào hết hạn hôm nay.", today);
            return;
        }

        log.info("[RentExpiry] {} | Tìm thấy {} building hết hạn, đang chuyển về AVAILABLE...",
                today, expired.size());

        for (BuildingEntity building : expired) {
            log.info("[RentExpiry] Building id={} | name='{}' | rentEndDate={} → AVAILABLE",
                    building.getId(), building.getName(), building.getRentEndDate());

            building.setBuildingStatus(BuildingStatus.AVAILABLE);
            building.setRentStartDate(null);
            building.setRentEndDate(null);
        }

        buildingRepository.saveAll(expired);

        log.info("[RentExpiry] {} | Hoàn tất. Đã giải phóng {} building.", today, expired.size());
    }
}