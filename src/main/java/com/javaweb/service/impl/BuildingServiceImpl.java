package com.javaweb.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.converter.BuildingConverter;
import com.javaweb.converter.BuildingSearchBuilderConverter;
import com.javaweb.converter.BuildingSearchResponseConverter;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.RentAreaEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.enums.TypeCode;
import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.model.response.ResponseDTO;
import com.javaweb.model.response.StaffResponseDTO;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.RentAreaRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.repository.custom.BuildingRepositoryCustom;
import com.javaweb.service.AssignmentBuildingService;
import com.javaweb.service.BuildingService;
import com.javaweb.service.RentAreaService;
import com.javaweb.utils.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BuildingServiceImpl implements BuildingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuildingSearchBuilderConverter buildingSearchBuilderConverter;

    @Autowired
    private BuildingRepositoryCustom buildingRepositoryCustom;

    @Autowired
    private BuildingSearchResponseConverter buildingSearchResponseConverter;

    @Autowired
    private BuildingConverter buildingConverter;

    @Autowired
    private RentAreaService rentAreaService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AssignmentBuildingService assignmentBuildingService;

    @Autowired
    private RentAreaRepository rentAreaRepository;

    @Override
    public ResponseDTO listStaffs(Long buildingId) {
        BuildingEntity building = buildingRepository.findById(buildingId).get();
        List<UserEntity> staffs = userRepository.findByStatusAndRoles_Code(1, "STAFF");
        List<UserEntity> staffAssignment = building.getUsers();
        List<StaffResponseDTO> staffResponseDTOS = new ArrayList<>();
        ResponseDTO responseDTO = new ResponseDTO();

        for (UserEntity it : staffs) {
            StaffResponseDTO staffResponseDTO = new StaffResponseDTO();
            staffResponseDTO.setStaffId(it.getId());
            staffResponseDTO.setFullName(it.getFullName());
            if (staffAssignment.contains(it)) {
                staffResponseDTO.setChecked("checked");
            } else {
                staffResponseDTO.setChecked("");
            }
            staffResponseDTOS.add(staffResponseDTO);
        }
        responseDTO.setData(staffResponseDTOS);
        responseDTO.setMessage("Success");
        return responseDTO;
    }

    @Override
    public List<BuildingSearchResponse> findAll(BuildingSearchRequest buildingSearchRequest) {
        List<String> typeCode = buildingSearchRequest.getTypeCode();
        BuildingSearchBuilder buildingSearchBuilder = buildingSearchBuilderConverter.toBuildingSearchBuilder(buildingSearchRequest, typeCode);
        List<BuildingEntity> buildingEntities = buildingRepositoryCustom.findAll(buildingSearchBuilder);
        List<BuildingSearchResponse> res = new ArrayList<>();
        for (BuildingEntity it : buildingEntities) {
            BuildingSearchResponse building = buildingSearchResponseConverter.toBuildingSearchResponse(it);
            res.add(building);
        }
        return res;
    }

    @Override
    public void assignBuilding(AssignmentBuildingDTO dto) {
        BuildingEntity building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        List<UserEntity> validStaffs = userRepository.findStaffs("STAFF");

        Map<Long, UserEntity> staffMap = validStaffs.stream()
                .collect(Collectors.toMap(UserEntity::getId, item -> item));

        List<UserEntity> newStaffs = new ArrayList<>();

        if (dto.getStaffIds() != null) {
            for (Long staffId : dto.getStaffIds()) {
                if (staffMap.containsKey(staffId)) {
                    newStaffs.add(staffMap.get(staffId));
                }
            }
        }

        building.setUsers(newStaffs);
        buildingRepository.save(building);
    }

    @Override
    public BuildingDTO getBuildingDetail(Long id) {
        BuildingEntity entity = buildingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building not found"));

        // Map thủ công - KHÔNG dùng ModelMapper
        BuildingDTO buildingDTO = new BuildingDTO();

        // Các field cơ bản
        buildingDTO.setId(entity.getId());
        buildingDTO.setName(entity.getName());
        buildingDTO.setStreet(entity.getStreet());
        buildingDTO.setStructure(entity.getStructure());
        buildingDTO.setNote(entity.getNote());
        buildingDTO.setImage(entity.getImage());
        buildingDTO.setAvatar(entity.getAvatar());
        buildingDTO.setFloorArea(entity.getFloorArea());
        buildingDTO.setNumberOfBasement(entity.getNumberOfBasement());
        buildingDTO.setDirection(entity.getDirection());
        buildingDTO.setLevel(entity.getLevel());
        buildingDTO.setRentPrice(entity.getRentPrice());
        buildingDTO.setRentPriceDescription(entity.getRentPriceDescription());
        buildingDTO.setServiceFee(entity.getServiceFee());
        buildingDTO.setCarFee(entity.getCarFee());
        buildingDTO.setMotoFee(entity.getMotoFee());
        buildingDTO.setOvertimeFee(entity.getOvertimeFee());
        buildingDTO.setWaterFee(entity.getWaterFee());
        buildingDTO.setElectricityFee(entity.getElectricityFee());
        buildingDTO.setDeposit(entity.getDeposit());
        buildingDTO.setPayment(entity.getPayment());
        buildingDTO.setRentTime(entity.getRentTime());
        buildingDTO.setDecorationTime(entity.getDecorationTime());
        buildingDTO.setBrokerageFee(entity.getBrokerageFee());
        buildingDTO.setManagerName(entity.getManagerName());
        buildingDTO.setManagerPhone(entity.getManagerPhone());
        buildingDTO.setMap(entity.getMap());
        buildingDTO.setLinkOfBuilding(entity.getLinkOfBuilding());
        buildingDTO.setLegal(entity.getLegal());

        // Địa chỉ mới
        buildingDTO.setWard(entity.getWardName());          // ward = wardName
        buildingDTO.setWardName(entity.getWardName());
        buildingDTO.setWardCode(entity.getWardCode());
        buildingDTO.setProvinceCode(entity.getProvinceCode());
        buildingDTO.setProvinceName(entity.getProvinceName());
        buildingDTO.setStreet(entity.getStreet());

        // Field cũ (migration)
        buildingDTO.setDistrict(entity.getDistrictLegacy());

        // Giá
        buildingDTO.setPriceSale(entity.getPriceSale());
        buildingDTO.setPriceRent(entity.getPriceRent());
        buildingDTO.setTransactionType(entity.getTransactionType());

        // Xử lý type từ String -> String[]
        if (entity.getType() != null && !entity.getType().isEmpty()) {
            buildingDTO.setTypeCode(entity.getType().split(","));
        }

        // Xử lý rentArea từ List<RentAreaEntity> -> String
        if (entity.getRentAreas() != null && !entity.getRentAreas().isEmpty()) {
            String rentArea = entity.getRentAreas().stream()
                    .map(item -> String.valueOf(item.getValue()))
                    .reduce((a, b) -> a + "," + b)
                    .orElse("");
            buildingDTO.setRentArea(rentArea);
        }

        return buildingDTO;
    }

    @Override
    @Transactional
    public BuildingDTO addOrUpdateBuilding(BuildingDTO buildingDTO) {
        BuildingEntity buildingEntity;

        // Nếu có ID -> update, không thì tạo mới
        if (buildingDTO.getId() != null) {
            buildingEntity = buildingRepository.findById(buildingDTO.getId())
                    .orElse(new BuildingEntity());
        } else {
            buildingEntity = new BuildingEntity();
        }

        // Map các field cơ bản từ DTO sang Entity
        modelMapper.map(buildingDTO, buildingEntity);

        // Xử lý typeCode: từ String[] (trong DTO) -> String (lưu trong DB, cách nhau bằng dấu phẩy)
        // Ví dụ: ["TANG_TRET", "NGUYEN_CAN"] -> "TANG_TRET,NGUYEN_CAN"
        if (buildingDTO.getTypeCode() != null && buildingDTO.getTypeCode().length > 0) {
            buildingEntity.setType(String.join(",", buildingDTO.getTypeCode()));
        }

        // Lưu building vào database
        buildingEntity = buildingRepository.save(buildingEntity);
        buildingDTO.setId(buildingEntity.getId());

        // Xử lý rentArea
        if (buildingDTO.getRentArea() != null && !buildingDTO.getRentArea().trim().isEmpty()) {
            // Xóa rentArea cũ nếu có
            if (buildingDTO.getId() != null) {
                List<RentAreaEntity> oldRentAreas = rentAreaRepository.findByBuildingId(buildingEntity.getId());
                if (oldRentAreas != null && !oldRentAreas.isEmpty()) {
                    rentAreaRepository.deleteAll(oldRentAreas);
                }
            }
            // Thêm rentArea mới
            rentAreaService.addRentArea(buildingDTO);
        }

        return buildingDTO;
    }

    @Override
    public BuildingDTO getBuildingById(Long id) {
        BuildingEntity buildingEntity = buildingRepository.findById(id).orElse(null);
        if (buildingEntity != null) {
            BuildingDTO buildingDTO = buildingConverter.convertToDTO(buildingEntity);
            return buildingDTO;
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteBuilding(List<Long> ids) {
        assignmentBuildingService.deleteByBuildingIds(ids);
        rentAreaService.deleteByBuildingIds(ids);
        for (Long id : ids) {
            buildingRepository.deleteById(id);
        }
    }
}