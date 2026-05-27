//package com.javaweb.service;
//
//import com.javaweb.config.commission.CommissionConfig;
//import com.javaweb.entity.BuildingEntity;
//import com.javaweb.model.dto.BuildingScoreDTO;
//import com.javaweb.repository.BuildingRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class BuildingScoringService {
//
//    @Autowired
//    private BuildingRepository buildingRepository;
//
//    @Autowired
//    private CommissionConfig commissionConfig;
//
//    /**
//     * Tính điểm cho tất cả building theo loại giao dịch
//     * @param transactionType "SALE" hoặc "RENT"
//     * @return Danh sách building có điểm
//     */
//    public List<BuildingScoreDTO> scoreAllBuildings(String transactionType) {
//        // Validate transactionType
//        if (transactionType == null ||
//                (!"SALE".equalsIgnoreCase(transactionType) && !"RENT".equalsIgnoreCase(transactionType))) {
//            return new ArrayList<>();
//        }
//
//        List<BuildingEntity> buildings = buildingRepository.findAll();
//
//        if (buildings == null || buildings.isEmpty()) {
//            return new ArrayList<>();
//        }
//
//        return buildings.stream()
//                .map(building -> calculateBuildingScore(building, transactionType))
//                .filter(score -> score.getPriceScore() > 0)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Tính điểm cho 1 building
//     */
//    private BuildingScoreDTO calculateBuildingScore(BuildingEntity building, String transactionType) {
//        double priceScore = calculatePriceScore(building, transactionType);
//
//        // Nếu không có giá hoặc không hỗ trợ loại giao dịch, bỏ qua
//        if (priceScore == 0) {
//            return new BuildingScoreDTO(
//                    building.getId(),
//                    building.getName(),
//                    0.0,
//                    0.0,
//                    0.0,
//                    0.0
//            );
//        }
//
//        double legalScore = calculateLegalScore(building);
//        double liquidityScore = calculateLiquidityScore(building);
//
//        // Score = (Price × 0.5) + (Legal × 0.4) + (Liquidity × 0.1)
//        double totalScore = (priceScore * 0.5) + (legalScore * 0.4) + (liquidityScore * 0.1);
//
//        // Làm tròn 2 chữ số thập phân
//        totalScore = Math.round(totalScore * 100.0) / 100.0;
//
//        return new BuildingScoreDTO(
//                building.getId(),
//                building.getName(),
//                priceScore,
//                legalScore,
//                liquidityScore,
//                totalScore
//        );
//    }
//
//    /**
//     * Tính điểm giá (S_Price)
//     * - SALE: min(1.0, price_sale / 5 tỷ)
//     * - RENT: min(1.0, price_rent / 15 triệu)
//     * - Không có giá hoặc không hỗ trợ loại giao dịch -> trả về 0
//     */
//    private double calculatePriceScore(BuildingEntity building, String transactionType) {
//        // BƯỚC 1: Kiểm tra building có hỗ trợ loại giao dịch này không
//        // SỬA: Chuyển enum sang String
//        String buildingTxType = building.getTransactionType() != null ?
//                building.getTransactionType().name() : null;
//
//        if (buildingTxType == null || buildingTxType.isEmpty()) {
//            return 0;
//        }
//
//        if ("SALE".equalsIgnoreCase(transactionType)) {
//            if (!"SALE".equalsIgnoreCase(buildingTxType) && !"BOTH".equalsIgnoreCase(buildingTxType)) {
//                return 0;
//            }
//        } else if ("RENT".equalsIgnoreCase(transactionType)) {
//            if (!"RENT".equalsIgnoreCase(buildingTxType) && !"BOTH".equalsIgnoreCase(buildingTxType)) {
//                return 0;
//            }
//        } else {
//            return 0;
//        }
//
//        // BƯỚC 2: Lấy giá theo loại giao dịch
//        Double price = null;
//        double maxPrice = 0;
//
//        if ("SALE".equalsIgnoreCase(transactionType)) {
//            price = building.getPriceSale();
//            maxPrice = commissionConfig.getMaxPriceSale();
//        } else if ("RENT".equalsIgnoreCase(transactionType)) {
//            price = building.getPriceRent();
//            maxPrice = commissionConfig.getMaxPriceRent();
//        } else {
//            return 0;
//        }
//
//        if (price == null || price <= 0 || maxPrice <= 0) {
//            return 0;
//        }
//
//        double score = price / maxPrice;
//        double result = Math.min(1.0, Math.max(0, score));
//
//        return Math.round(result * 100.0) / 100.0;
//    }
//
//    /**
//     * Tính điểm pháp lý (S_Legal)
//     * - SO_HONG, SO_DO: 1.0
//     * - KHONG_SO: 0.1
//     */
//    private double calculateLegalScore(BuildingEntity building) {
//        if (building.getLegal() == null) {
//            return 1.0;
//        }
//
//        switch (building.getLegal()) {
//            case SO_HONG:
//            case SO_DO:
//                return 1.0;
//            case KHONG_SO:
//                return 0.1;
//            default:
//                return 0.5;
//        }
//    }
//
//    /**
//     * Tính điểm thanh khoản (S_Liquidity)
//     * - < 6 tháng: 0.2
//     * - >= 6 tháng: 0.8
//     */
//    private double calculateLiquidityScore(BuildingEntity building) {
//        if (building.getCreatedDate() == null) {
//            return 0.5;
//        }
//
//        long createdTime = building.getCreatedDate().getTime();
//        long currentTime = System.currentTimeMillis();
//        long daysDiff = (currentTime - createdTime) / (1000 * 60 * 60 * 24);
//
//        return (daysDiff < 180) ? 0.2 : 0.8;
//    }
//}