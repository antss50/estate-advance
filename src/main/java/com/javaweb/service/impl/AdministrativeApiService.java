package com.javaweb.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.entity.ProvinceEntity;
import com.javaweb.entity.WardEntity;
import com.javaweb.repository.ProvinceRepository;
import com.javaweb.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AdministrativeApiService {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private WardRepository wardRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void syncAllData() {
        if (provinceRepository.count() > 0) {
            System.out.println("Dữ liệu địa chỉ đã tồn tại, skip sync.");
            return;
        }

        System.out.println("Bắt đầu đồng bộ dữ liệu địa chỉ từ file JSON...");
        try {
            ClassPathResource resource = new ClassPathResource("data/vietnamAddress.json");
            List<Map<String, Object>> provincesData = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            List<ProvinceEntity> provinces = new ArrayList<>();

            for (Map<String, Object> provinceData : provincesData) {
                ProvinceEntity province = new ProvinceEntity();
                province.setCode((String) provinceData.get("Id"));
                province.setName((String) provinceData.get("Name"));
                province.setIsActive(true);
                provinces.add(province);
            }

            provinceRepository.saveAll(provinces);
            System.out.println("Đã lưu " + provinces.size() + " tỉnh/thành phố");

            // Lấy danh sách phường/xã (bỏ qua cấp huyện)
            List<WardEntity> allWards = new ArrayList<>();
            for (Map<String, Object> provinceData : provincesData) {
                String provinceCode = (String) provinceData.get("Id");
                ProvinceEntity province = provinceRepository.findByCode(provinceCode).orElse(null);

                if (province != null && provinceData.containsKey("Districts")) {
                    List<Map<String, Object>> districts = (List<Map<String, Object>>) provinceData.get("Districts");

                    for (Map<String, Object> district : districts) {
                        if (district.containsKey("Wards")) {
                            List<Map<String, Object>> wards = (List<Map<String, Object>>) district.get("Wards");

                            for (Map<String, Object> wardData : wards) {
                                WardEntity ward = new WardEntity();
                                ward.setCode((String) wardData.get("Id"));
                                ward.setName((String) wardData.get("Name"));
                                ward.setProvince(province);
                                ward.setIsActive(true);
                                allWards.add(ward);
                            }
                        }
                    }
                }
            }

            if (!allWards.isEmpty()) {
                wardRepository.saveAll(allWards);
                System.out.println("Đã lưu " + allWards.size() + " xã/phường");
            }

            System.out.println("Hoàn tất đồng bộ dữ liệu địa chỉ!");

        } catch (Exception e) {
            System.err.println("Lỗi khi đồng bộ dữ liệu: " + e.getMessage());
            e.printStackTrace();
        }
    }
}