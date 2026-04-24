package com.javaweb.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.entity.ProvinceEntity;
import com.javaweb.entity.WardEntity;
import com.javaweb.repository.ProvinceRepository;
import com.javaweb.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdministrativeApiService {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private WardRepository wardRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String BASE_URL = "https://diachi.tuoitreit.vn/api.php";

    @Value("${administrative.api.key:}")
    private String apiKey;

    public List<ProvinceEntity> fetchProvincesFromApi() {
        List<ProvinceEntity> provinces = new ArrayList<>();
        try {
            String url = BASE_URL + "?action=provinces";
            if (apiKey != null && !apiKey.isEmpty()) {
                url += "&api_key=" + apiKey;
            }
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            if (jsonNode.has("data")) {
                for (JsonNode item : jsonNode.get("data")) {
                    ProvinceEntity province = new ProvinceEntity();
                    province.setCode(item.get("id").asText());
                    province.setName(item.get("name").asText());
                    province.setIsActive(true);
                    provinces.add(province);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return provinces;
    }

    public List<WardEntity> fetchWardsFromApi(String provinceCode, ProvinceEntity province) {
        List<WardEntity> wards = new ArrayList<>();
        try {
            String url = BASE_URL + "?action=wards&province_id=" + provinceCode;
            if (apiKey != null && !apiKey.isEmpty()) {
                url += "&api_key=" + apiKey;
            }
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            if (jsonNode.has("data")) {
                for (JsonNode item : jsonNode.get("data")) {
                    WardEntity ward = new WardEntity();
                    ward.setCode(item.get("id").asText());
                    ward.setName(item.get("name").asText());
                    ward.setProvince(province);
                    ward.setIsActive(true);
                    wards.add(ward);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return wards;
    }

    @PostConstruct
    public void syncAllData() {
        if (provinceRepository.count() > 0) {
            System.out.println("Dữ liệu địa chỉ đã tồn tại, skip sync.");
            return;
        }

        System.out.println("Bắt đầu đồng bộ dữ liệu địa chỉ từ API...");
        try {
            List<ProvinceEntity> provinces = fetchProvincesFromApi();
            provinceRepository.saveAll(provinces);
            System.out.println("Đã lưu " + provinces.size() + " tỉnh/thành phố");

            for (ProvinceEntity province : provinces) {
                List<WardEntity> wards = fetchWardsFromApi(province.getCode(), province);
                wardRepository.saveAll(wards);
                System.out.println("Đã lưu " + wards.size() + " xã/phường cho " + province.getName());
            }
            System.out.println("Hoàn tất đồng bộ dữ liệu địa chỉ!");
        } catch (Exception e) {
            System.err.println("Lỗi khi đồng bộ dữ liệu: " + e.getMessage());
        }
    }
}