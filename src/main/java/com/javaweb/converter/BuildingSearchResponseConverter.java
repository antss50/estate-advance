package com.javaweb.converter;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.enums.District;
import com.javaweb.model.response.BuildingSearchResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class BuildingSearchResponseConverter {
    @Autowired
    private ModelMapper modelMapper;

    public BuildingSearchResponse toBuildingSearchResponse(BuildingEntity buildingEntity)
    {
        BuildingSearchResponse res = modelMapper.map(buildingEntity, BuildingSearchResponse.class);

        // Xử lý rentArea
        if(buildingEntity.getRentAreas() != null && !buildingEntity.getRentAreas().isEmpty()) {
            res.setRentArea(buildingEntity.getRentAreas().stream()
                    .map(entity -> String.valueOf(entity.getValue()))
                    .collect(Collectors.joining(",")));
        }

        // ============ SỬA LẠI PHẦN NÀY ============
        // Xử lý address với cấu trúc mới: street + wardName + provinceName
        String wardName = buildingEntity.getWardName() != null ? buildingEntity.getWardName() : "";
        String provinceName = buildingEntity.getProvinceName() != null ? buildingEntity.getProvinceName() : "";
        String street = buildingEntity.getStreet() != null ? buildingEntity.getStreet() : "";

        // Tạo địa chỉ đầy đủ
        String fullAddress = street;
        if (!wardName.isEmpty()) {
            fullAddress += (fullAddress.isEmpty() ? "" : ", ") + wardName;
        }
        if (!provinceName.isEmpty()) {
            fullAddress += (fullAddress.isEmpty() ? "" : ", ") + provinceName;
        }
        res.setAddress(fullAddress);
        // ============ KẾT THÚC SỬA ============

        // Thêm xử lý cho structure và note
        res.setStructure(buildingEntity.getStructure());
        res.setNote(buildingEntity.getNote());

        // Xử lý image đầu tiên từ mảng images
        String firstImage = getFirstImage(buildingEntity.getImage());
        res.setImage(firstImage);

        return res;
    }

    /**
     * Lấy ảnh đầu tiên từ chuỗi images
     * Hỗ trợ nhiều định dạng: JSON array, CSV, hoặc single string
     */
    private String getFirstImage(String imageString) {
        if (imageString == null || imageString.trim().isEmpty()) {
            return null;
        }

        String trimmed = imageString.trim();

        // Trường hợp 1: JSON array format: ["url1.jpg", "url2.jpg"]
        if (trimmed.startsWith("[")) {
            int firstQuote = trimmed.indexOf("\"");
            if (firstQuote != -1) {
                int secondQuote = trimmed.indexOf("\"", firstQuote + 1);
                if (secondQuote != -1) {
                    return trimmed.substring(firstQuote + 1, secondQuote);
                }
            }
            else if (trimmed.contains(",")) {
                String firstUrl = trimmed.substring(1, trimmed.indexOf(",")).trim();
                return firstUrl;
            }
            else {
                String firstUrl = trimmed.substring(1, trimmed.length() - 1).trim();
                return firstUrl;
            }
        }

        // Trường hợp 2: CSV format
        if (trimmed.contains(",")) {
            return trimmed.split(",")[0].trim();
        }

        // Trường hợp 3: Chỉ có 1 URL
        return trimmed;
    }
}