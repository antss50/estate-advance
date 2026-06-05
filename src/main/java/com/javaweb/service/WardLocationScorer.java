package com.javaweb.service;

import com.javaweb.repository.WardAdjacencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Tính điểm vị trí (S_Location) dựa trên tên phường/xã.
 *
 * Quy tắc:
 *   Cùng phường/xã      → 1.0
 *   Lân cận (giáp ranh) → 0.6
 *   Khác xa             → 0.2
 */
@Service
public class WardLocationScorer {

    private static final double SCORE_SAME     = 1.0;
    private static final double SCORE_ADJACENT = 0.6;
    private static final double SCORE_FAR      = 0.2;

    @Autowired
    private WardAdjacencyRepository wardAdjacencyRepository;

    /**
     * @param buildingWardName  wardName của building trong DB
     * @param demandWardName    tên phường khách gửi lên (VD: "Phường Bến Nghé")
     */
    public double score(String buildingWardName, String demandWardName) {
        if (isBlank(demandWardName)) return SCORE_SAME;
        if (isBlank(buildingWardName)) return SCORE_FAR;

        // Cùng phường
        if (normalize(buildingWardName).equals(normalize(demandWardName))) {
            return SCORE_SAME;
        }

        // Lân cận: kiểm tra bảng ward_adjacency theo tên
        if (wardAdjacencyRepository.existsByWardNameAAndWardNameB(
                buildingWardName, demandWardName)) {
            return SCORE_ADJACENT;
        }

        return SCORE_FAR;
    }

    private String normalize(String s) {
        return s.trim().toLowerCase();
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}