package com.javaweb.service;

import com.javaweb.repository.WardAdjacencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Tính điểm vị trí (S_Location) dựa trên bảng ward_adjacency trong DB.
 *
 * Quy tắc:
 *   Cùng ward (wardCode khớp)             → 1.0
 *   Lân cận  (có bản ghi trong adjacency) → 0.6
 *   Khác xa  (không có bản ghi)           → 0.2
 *
 * Thay thế logic cũ "cùng province = lân cận" bằng dữ liệu geometry thực.
 */
@Service
public class WardLocationScorer {

    private static final double SCORE_SAME     = 1.0;
    private static final double SCORE_ADJACENT = 0.6;
    private static final double SCORE_FAR      = 0.2;

    @Autowired
    private WardAdjacencyRepository wardAdjacencyRepository;

    /**
     * @param buildingWardCode  wardCode của building
     * @param demandWardCode    wardCode yêu cầu của khách
     * @return S_Location trong {0.2, 0.6, 1.0}
     */
    public double score(String buildingWardCode, String demandWardCode) {

        // Không có yêu cầu vị trí → khớp hoàn toàn
        if (isBlank(demandWardCode)) return SCORE_SAME;

        // Không có thông tin building → xa
        if (isBlank(buildingWardCode)) return SCORE_FAR;

        // Cùng phường/xã
        if (buildingWardCode.equalsIgnoreCase(demandWardCode)) return SCORE_SAME;

        // Lân cận: kiểm tra bảng ward_adjacency (đã lưu 2 chiều)
        if (wardAdjacencyRepository.existsByWardCodeAAndWardCodeB(
                buildingWardCode, demandWardCode)) {
            return SCORE_ADJACENT;
        }

        return SCORE_FAR;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}