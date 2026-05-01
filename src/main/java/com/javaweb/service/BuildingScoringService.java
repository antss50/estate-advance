package com.javaweb.service;

import com.javaweb.config.CommissionConfig;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.dto.BuildingScoreDTO;
import com.javaweb.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuildingScoringService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private CommissionConfig commissionConfig;

    public List<BuildingScoreDTO> scoreAllBuildings(String transactionType) {
        List<BuildingEntity> buildings = buildingRepository.findAll();

        return buildings.stream()
                .map(building -> calculateBuildingScore(building, transactionType))
                .collect(Collectors.toList());
    }

    private BuildingScoreDTO calculateBuildingScore(BuildingEntity building, String transactionType) {
        double priceScore = calculatePriceScore(building, transactionType);
        double legalScore = calculateLegalScore(building);
        double liquidityScore = calculateLiquidityScore(building);

        // Score = (Price × 0.5) + (Legal × 0.4) + (Liquidity × 0.1)
        double totalScore = (priceScore * 0.5) + (legalScore * 0.4) + (liquidityScore * 0.1);

        return new BuildingScoreDTO(
                building.getId(),
                building.getName(),
                priceScore,
                legalScore,
                liquidityScore,
                totalScore
        );
    }

    private double calculatePriceScore(BuildingEntity building, String transactionType) {
        Double price = null;
        double maxPrice = 0;

        if ("SALE".equalsIgnoreCase(transactionType)) {
            price = building.getPriceSale();
            maxPrice = commissionConfig.getMaxPriceSale(); // 5 tỷ
        } else if ("RENT".equalsIgnoreCase(transactionType)) {
            price = building.getPriceRent();
            maxPrice = commissionConfig.getMaxPriceRent(); // 15 triệu
        } else {
            if (building.getPriceSale() != null) {
                price = building.getPriceSale();
                maxPrice = commissionConfig.getMaxPriceSale();
            } else if (building.getPriceRent() != null) {
                price = building.getPriceRent();
                maxPrice = commissionConfig.getMaxPriceRent();
            } else {
                return 0.5;
            }
        }

        if (price == null || price <= 0 || maxPrice <= 0) {
            return 0.5;
        }

        double score = price / maxPrice;
        return Math.min(1.0, Math.max(0, score));
    }

    // Trong BuildingScoringService.java
    private double calculateLegalScore(BuildingEntity building) {
        if (building.getLegal() == null) {
            return 1.0;
        }

        switch (building.getLegal()) {
            case SO_HONG:
            case SO_DO:
                return 1.0;     // Có sổ -> điểm cao
            case KHONG_SO:
                return 0.1;     // Không sổ -> điểm thấp
            default:
                return 0.5;
        }
    }

    private double calculateLiquidityScore(BuildingEntity building) {
        if (building.getCreatedDate() != null) {
            long createdTime = building.getCreatedDate().getTime();
            long currentTime = System.currentTimeMillis();
            long daysDiff = (currentTime - createdTime) / (1000 * 60 * 60 * 24);

            if (daysDiff < 180) {
                return 0.2;
            } else {
                return 0.8;
            }
        }
        return 0.5;
    }
}