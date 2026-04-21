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

        // Xử lý address
        String districtName = "";
        if(buildingEntity.getDistrict() != null && buildingEntity.getDistrict() != ""){
            districtName = buildingEntity.getDistrict();
        }
        if(districtName != null && districtName != ""){
            res.setAddress(buildingEntity.getStreet() + ", " + buildingEntity.getWard() + ", " + districtName);
        }

        // Thêm xử lý cho structure và note
        // ModelMapper đã tự động map structure và note nếu tên field giống nhau
        // Nhưng để đảm bảo, có thể set trực tiếp
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
            // Tìm URL đầu tiên trong JSON array
            int firstQuote = trimmed.indexOf("\"");
            if (firstQuote != -1) {
                int secondQuote = trimmed.indexOf("\"", firstQuote + 1);
                if (secondQuote != -1) {
                    return trimmed.substring(firstQuote + 1, secondQuote);
                }
            }
            // Trường hợp JSON array không có quotes: [url1.jpg, url2.jpg]
            else if (trimmed.contains(",")) {
                String firstUrl = trimmed.substring(1, trimmed.indexOf(",")).trim();
                return firstUrl;
            }
            // Trường hợp chỉ có 1 phần tử trong array
            else {
                String firstUrl = trimmed.substring(1, trimmed.length() - 1).trim();
                return firstUrl;
            }
        }

        // Trường hợp 2: CSV format: url1.jpg, url2.jpg
        if (trimmed.contains(",")) {
            return trimmed.split(",")[0].trim();
        }

        // Trường hợp 3: Chỉ có 1 URL
        return trimmed;
    }
}