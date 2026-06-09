package com.javaweb.service;

import com.javaweb.entity.WardAdjacencyEntity;
import com.javaweb.repository.WardAdjacencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
public class WardLocationScorer {

    private static final double SCORE_SAME     = 1.0;
    private static final double SCORE_ADJACENT = 0.6;
    private static final double SCORE_FAR      = 0.2;

    private static final List<String> PREFIXES = Arrays.asList(
            "phường", "phuong", "xã", "xa", "thị trấn", "thi tran",
            "quận", "quan", "huyện", "huyen", "thành phố", "thanh pho",
            "thị xã", "thi xa", "tp."
    );

    @Autowired
    private WardAdjacencyRepository wardAdjacencyRepository;

    public double score(String staffWardName, String buildingWardName) {
        if (isBlank(staffWardName)) return SCORE_FAR;
        if (isBlank(buildingWardName)) return SCORE_SAME;

        String staffNorm = normalizeWardName(staffWardName);
        String buildingNorm = normalizeWardName(buildingWardName);

        if (staffNorm.equals(buildingNorm)) {
            return SCORE_SAME;
        }

        if (isAdjacent(staffNorm, buildingNorm)) {
            return SCORE_ADJACENT;
        }

        return SCORE_FAR;
    }

    private boolean isAdjacent(String staffNorm, String buildingNorm) {
        for (WardAdjacencyEntity adjacency : wardAdjacencyRepository.findAll()) {
            String a = normalizeWardName(adjacency.getWardNameA());
            String b = normalizeWardName(adjacency.getWardNameB());

            boolean forward = a.equals(staffNorm) && b.equals(buildingNorm);
            boolean backward = a.equals(buildingNorm) && b.equals(staffNorm);
            if (forward || backward) {
                return true;
            }
        }
        return false;
    }

    private String normalizeWardName(String wardName) {
        if (wardName == null) return "";

        String normalized = wardName.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ");

        for (String prefix : PREFIXES) {
            if (normalized.startsWith(prefix + " ")) {
                normalized = normalized.substring(prefix.length() + 1);
                break;
            }
        }

        return normalized.trim();
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
