package com.javaweb.service.impl;

import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.converter.BuildingConverter;
import com.javaweb.converter.BuildingSearchBuilderConverter;
import com.javaweb.converter.BuildingSearchResponseConverter;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.RentAreaEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingByStaffResponse;
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
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
        BuildingEntity building = buildingRepository.findById(buildingId).orElse(null);
        if (building == null) {
            ResponseDTO responseDTO = new ResponseDTO();
            responseDTO.setMessage("Building not found");
            return responseDTO;
        }

        List<UserEntity> staffs = userRepository.findByStatusAndRoles_Code(1, "STAFF");

        staffs = staffs.stream()
                .distinct()
                .collect(Collectors.toList());

        List<UserEntity> staffAssignment = building.getUsers();

        List<StaffResponseDTO> staffResponseDTOS = new ArrayList<>();
        ResponseDTO responseDTO = new ResponseDTO();

        for (UserEntity it : staffs) {
            StaffResponseDTO staffResponseDTO = new StaffResponseDTO();
            staffResponseDTO.setStaffId(it.getId());
            staffResponseDTO.setFullName(it.getFullName());

            boolean isAssigned = staffAssignment.stream()
                    .anyMatch(staff -> staff.getId().equals(it.getId()));

            staffResponseDTO.setChecked(isAssigned ? "checked" : "");
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
                .distinct()
                .collect(Collectors.toMap(UserEntity::getId, item -> item, (existing, replacement) -> existing));

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
        return buildingConverter.convertToDTO(entity);
    }

    @Override
    @Transactional
    public BuildingDTO addOrUpdateBuilding(BuildingDTO buildingDTO) {
        BuildingEntity buildingEntity;

        if (buildingDTO.getId() != null) {
            buildingEntity = buildingRepository.findById(buildingDTO.getId())
                    .orElse(new BuildingEntity());
            BuildingEntity converted = buildingConverter.convertEntity(buildingDTO);
            converted.setId(buildingEntity.getId());
            buildingEntity = converted;
        } else {
            buildingEntity = buildingConverter.convertEntity(buildingDTO);
        }

        buildingEntity = buildingRepository.save(buildingEntity);
        buildingDTO.setId(buildingEntity.getId());

        if (buildingDTO.getRentArea() != null && !buildingDTO.getRentArea().trim().isEmpty()) {
            if (buildingDTO.getId() != null) {
                List<RentAreaEntity> oldRentAreas = rentAreaRepository.findByBuildingId(buildingEntity.getId());
                if (oldRentAreas != null && !oldRentAreas.isEmpty()) {
                    rentAreaRepository.deleteAll(oldRentAreas);
                }
            }
            rentAreaService.addRentArea(buildingDTO);
        }

        return buildingDTO;
    }

    @Override
    public BuildingDTO getBuildingById(Long id) {
        BuildingEntity buildingEntity = buildingRepository.findById(id).orElse(null);
        if (buildingEntity != null) {
            return buildingConverter.convertToDTO(buildingEntity);
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

    @Override
    public List<BuildingByStaffResponse> getBuildingsByStaffId(Long staffId) {
        List<BuildingEntity> buildings = buildingRepository.findBuildingsByStaffId(staffId);

        if (buildings == null || buildings.isEmpty()) {
            return new ArrayList<>();
        }

        return buildings.stream()
                .map(this::convertToBuildingByStaffResponse)
                .collect(Collectors.toList());
    }

    // ============ CONVERT TO BUILDING BY STAFF RESPONSE (ĐẦY ĐỦ THÔNG TIN) ============
    private BuildingByStaffResponse convertToBuildingByStaffResponse(BuildingEntity entity) {
        BuildingByStaffResponse response = new BuildingByStaffResponse();

        // ============ THÔNG TIN CƠ BẢN ============
        response.setBuildingId(entity.getId());
        response.setBuildingName(entity.getName());
        response.setStreet(entity.getStreet());
        response.setWardName(entity.getWardName());
        response.setProvinceName(entity.getProvinceName());

        // Địa chỉ đầy đủ
        String address = (entity.getStreet() != null ? entity.getStreet() : "") +
                (entity.getWardName() != null ? ", " + entity.getWardName() : "") +
                (entity.getProvinceName() != null ? ", " + entity.getProvinceName() : "");
        response.setAddress(address);

        // ============ DIỆN TÍCH VÀ GIÁ ============
        response.setFloorArea(entity.getFloorArea());
        response.setPriceSale(entity.getPriceSale());
        response.setPriceRent(entity.getPriceRent());
        response.setRentPrice(entity.getRentPrice());
        response.setRentPriceDescription(entity.getRentPriceDescription());

        // ============ LOẠI GIAO DỊCH VÀ LOẠI BĐS ============
        if (entity.getTransactionType() != null) {
            response.setTransactionType(entity.getTransactionType().name());
        }
        response.setType(entity.getPropertyType());

        // ============ THÔNG SỐ KỸ THUẬT ============
        response.setStructure(entity.getStructure());
        response.setNumberOfBasement(entity.getNumberOfBasement());
        response.setDirection(entity.getDirection());
        response.setLevel(entity.getLevel());

        // ============ PHÍ DỊCH VỤ ============
        response.setServiceFee(entity.getServiceFee());
        response.setCarFee(entity.getCarFee());
        response.setMotoFee(entity.getMotoFee());
        response.setOvertimeFee(entity.getOvertimeFee());
        response.setWaterFee(entity.getWaterFee());
        response.setElectricityFee(entity.getElectricityFee());

        // ============ THÔNG TIN THANH TOÁN ============
        response.setDeposit(entity.getDeposit());
        response.setPayment(entity.getPayment());
        response.setRentTime(entity.getRentTime());
        response.setDecorationTime(entity.getDecorationTime());
        response.setBrokerageFee(entity.getBrokerageFee());

        // ============ THÔNG TIN QUẢN LÝ ============
        response.setManagerName(entity.getManagerName());
        response.setManagerPhone(entity.getManagerPhone());

        // ============ PHÁP LÝ ============
        if (entity.getLegal() != null) {
            response.setLegal(entity.getLegal().name());
        }

        // ============ GHI CHÚ VÀ LINK ============
        response.setNote(entity.getNote());
        response.setLinkOfBuilding(entity.getLinkOfBuilding());
        response.setMap(entity.getMap());

        // ============ HÌNH ẢNH ============
        response.setAvatar(entity.getAvatar());

        if (entity.getImage() != null && !entity.getImage().isEmpty()) {
            List<String> imageList = Arrays.asList(entity.getImage().split(","));
            response.setImageList(imageList);
            if (!imageList.isEmpty()) {
                response.setImage(imageList.get(0));
            }
        }

        // ============ NGÀY THÁNG ============
        if (entity.getCreatedDate() != null) {
            response.setCreatedDate(entity.getCreatedDate().toString());
        }
        if (entity.getModifiedDate() != null) {
            response.setModifiedDate(entity.getModifiedDate().toString());
        }

        return response;
    }
    // ============ END ============
}