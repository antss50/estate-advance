package com.javaweb.service.impl;

import com.javaweb.converter.AdministrativeConverter;
import com.javaweb.model.dto.ProvinceDTO;
import com.javaweb.model.dto.WardDTO;
import com.javaweb.repository.ProvinceRepository;
import com.javaweb.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdministrativeService {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private AdministrativeConverter converter;

    public List<ProvinceDTO> getAllProvinces() {
        return converter.toProvinceDTOList(provinceRepository.findAllActiveOrderByName());
    }

    public List<WardDTO> getWardsByProvinceCode(String provinceCode) {
        return converter.toWardDTOList(wardRepository.findActiveByProvinceCode(provinceCode));
    }
}