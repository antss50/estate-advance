package com.javaweb.converter;

import com.javaweb.entity.ProvinceEntity;
import com.javaweb.entity.WardEntity;
import com.javaweb.model.dto.ProvinceDTO;
import com.javaweb.model.dto.WardDTO;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AdministrativeConverter {

    public ProvinceDTO toProvinceDTO(ProvinceEntity entity) {
        if (entity == null) return null;
        ProvinceDTO dto = new ProvinceDTO();
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setNameSlug(entity.getNameSlug());
        dto.setDivisionType(entity.getDivisionType());
        return dto;
    }

    public List<ProvinceDTO> toProvinceDTOList(List<ProvinceEntity> entities) {
        return entities.stream().map(this::toProvinceDTO).collect(Collectors.toList());
    }

    public WardDTO toWardDTO(WardEntity entity) {
        if (entity == null) return null;
        WardDTO dto = new WardDTO();
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setNameSlug(entity.getNameSlug());
        dto.setDivisionType(entity.getDivisionType());

        if (entity.getProvince() != null) {
            dto.setProvinceCode(entity.getProvince().getCode());
            dto.setProvinceName(entity.getProvince().getName());
        }
        return dto;
    }

    public List<WardDTO> toWardDTOList(List<WardEntity> entities) {
        return entities.stream().map(this::toWardDTO).collect(Collectors.toList());
    }
}