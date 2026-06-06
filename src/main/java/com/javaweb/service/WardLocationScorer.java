package com.javaweb.service;

import com.javaweb.repository.WardAdjacencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class WardLocationScorer {

    private static final double SCORE_SAME     = 1.0;
    private static final double SCORE_ADJACENT = 0.6;
    private static final double SCORE_FAR      = 0.2;

    // Các tiền tố cần loại bỏ (viết thường để so sánh)
    private static final List<String> PREFIXES = Arrays.asList(
            "phường", "xã", "thị trấn", "quận", "huyện", "thành phố", "thị xã", "tp."
    );

    @Autowired
    private WardAdjacencyRepository wardAdjacencyRepository;

    public double score(String buildingWardName, String demandWardName) {
        if (isBlank(demandWardName)) return SCORE_SAME;
        if (isBlank(buildingWardName)) return SCORE_FAR;

        // Chuẩn hóa: loại bỏ tiền tố, trim, lowerCase
        String buildingNorm = normalizeWardName(buildingWardName);
        String demandNorm = normalizeWardName(demandWardName);

        // Cùng phường (sau chuẩn hóa)
        if (buildingNorm.equals(demandNorm)) {
            return SCORE_SAME;
        }

        // Lân cận: kiểm tra trong bảng ward_adjacency với tên đã chuẩn hóa
        // (Giả sử dữ liệu trong bảng cũng đã được lưu dạng không tiền tố)
        if (wardAdjacencyRepository.existsByWardNameAAndWardNameB(buildingNorm, demandNorm)) {
            return SCORE_ADJACENT;
        }

        return SCORE_FAR;
    }

    /**
     * Loại bỏ tiền tố (Phường, Xã, ...) khỏi tên phường/xã.
     * Ví dụ: "Phường Bến Nghé" → "bến nghé"
     *        "Bến Nghé"        → "bến nghé"
     */
    private String normalizeWardName(String wardName) {
        if (wardName == null) return "";
        String normalized = wardName.trim().toLowerCase();
        for (String prefix : PREFIXES) {
            if (normalized.startsWith(prefix + " ")) {
                normalized = normalized.substring(prefix.length() + 1);
                break; // chỉ loại bỏ một tiền tố đầu tiên
            }
        }
        return normalized.trim();
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}