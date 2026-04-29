package com.javaweb.converter;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.response.BuildingSearchResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BuildingSearchResponseConverter {

    public BuildingSearchResponse toBuildingSearchResponse(BuildingEntity buildingEntity) {
        if (buildingEntity == null) {
            return null;
        }

        BuildingSearchResponse res = new BuildingSearchResponse();

        // Thông tin cơ bản
        res.setId(buildingEntity.getId());
        res.setName(buildingEntity.getName());

        // Địa chỉ
        String fullAddress = buildFullAddress(buildingEntity);
        res.setAddress(fullAddress);

        // Thông tin cấu trúc
        res.setStructure(buildingEntity.getStructure());
        res.setDirection(buildingEntity.getDirection());
        res.setLevel(buildingEntity.getLevel());

        // Số tầng hầm và diện tích sàn
        if (buildingEntity.getNumberOfBasement() != null) {
            res.setNumberOfBasement(buildingEntity.getNumberOfBasement().longValue());
        }
        if (buildingEntity.getFloorArea() != null) {
            res.setFloorArea(buildingEntity.getFloorArea().longValue());
        }

        // Giá thuê
        if (buildingEntity.getRentPrice() != null) {
            res.setRentPrice(buildingEntity.getRentPrice().longValue());
        } else if (buildingEntity.getPriceRent() != null) {
            res.setRentPrice(buildingEntity.getPriceRent().longValue());
        }

        // Mô tả giá thuê và các loại phí
        res.setRentPriceDescription(buildingEntity.getRentPriceDescription());
        res.setServiceFee(buildingEntity.getServiceFee());
        res.setCarFee(buildingEntity.getCarFee());
        res.setMotoFee(buildingEntity.getMotoFee());
        res.setOvertimeFee(buildingEntity.getOvertimeFee());
        res.setWaterFee(buildingEntity.getWaterFee());
        res.setElectricityFee(buildingEntity.getElectricityFee());

        // Tiền đặt cọc và thanh toán
        res.setDeposit(buildingEntity.getDeposit());
        res.setPayment(buildingEntity.getPayment());

        // Thời gian
        res.setRentTime(buildingEntity.getRentTime());
        res.setDecorationTime(buildingEntity.getDecorationTime());

        // Hoa hồng
        res.setBrokerageFee(buildingEntity.getBrokerageFee());

        // Ghi chú
        res.setNote(buildingEntity.getNote());

        // Link và hình ảnh
        res.setLinkOfBuilding(buildingEntity.getLinkOfBuilding());
        res.setMap(buildingEntity.getMap());
        res.setAvatar(buildingEntity.getAvatar());
        res.setImage(getFirstImage(buildingEntity.getImage()));

        // Giá bán và loại giao dịch
        res.setPriceSale(buildingEntity.getPriceSale());
        res.setTransactionType(buildingEntity.getTransactionType());

        // Thông tin quản lý
        res.setManagerName(buildingEntity.getManagerName());
        res.setManagerPhone(buildingEntity.getManagerPhone());

        // Tình trạng pháp lý
        if (buildingEntity.getLegal() != null) {
            res.setLegal(buildingEntity.getLegal().name());
        }

        // Diện tích thuê
        if (buildingEntity.getRentAreas() != null && !buildingEntity.getRentAreas().isEmpty()) {
            String rentAreaStr = buildingEntity.getRentAreas().stream()
                    .map(area -> String.valueOf(area.getValue()))
                    .collect(Collectors.joining(","));
            res.setRentArea(rentAreaStr);
        }

        return res;
    }

    private String buildFullAddress(BuildingEntity buildingEntity) {
        String street = buildingEntity.getStreet() != null ? buildingEntity.getStreet() : "";
        String wardName = buildingEntity.getWardName() != null ? buildingEntity.getWardName() : "";
        String provinceName = buildingEntity.getProvinceName() != null ? buildingEntity.getProvinceName() : "";

        StringBuilder address = new StringBuilder();
        if (!street.isEmpty()) {
            address.append(street);
        }
        if (!wardName.isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(wardName);
        }
        if (!provinceName.isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(provinceName);
        }
        return address.toString();
    }

    private String getFirstImage(String imageString) {
        if (imageString == null || imageString.trim().isEmpty()) {
            return null;
        }

        String trimmed = imageString.trim();

        // Xử lý JSON array
        if (trimmed.startsWith("[")) {
            int firstQuote = trimmed.indexOf("\"");
            if (firstQuote != -1) {
                int secondQuote = trimmed.indexOf("\"", firstQuote + 1);
                if (secondQuote != -1) {
                    return trimmed.substring(firstQuote + 1, secondQuote);
                }
            }
            // Nếu không có quotes, xử lý như mảng đơn giản
            String content = trimmed.substring(1, trimmed.length() - 1);
            if (content.contains(",")) {
                return content.split(",")[0].trim();
            }
            return content.trim();
        }

        // Xử lý CSV
        if (trimmed.contains(",")) {
            return trimmed.split(",")[0].trim();
        }

        return trimmed;
    }
}