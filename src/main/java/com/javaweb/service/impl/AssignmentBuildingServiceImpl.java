package com.javaweb.service.impl;

import com.javaweb.entity.AssignmentBuildingEntity;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.repository.AssignmentBuildingRepository;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.AssignmentBuildingService;
import com.javaweb.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service

public class AssignmentBuildingServiceImpl implements AssignmentBuildingService {

    @Autowired
    private BuildingRepository buildingRepository;
    @Autowired
    private AssignmentBuildingRepository assignmentBuildingRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public void addOrUpdateAssignmentBuilding(AssignmentBuildingDTO requestData) {


        //  Tìm building
        BuildingEntity building = buildingRepository.findById(requestData.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tòa nhà với ID: " + requestData.getBuildingId()));

            assignmentBuildingRepository.deleteByBuilding(building);


        //  Tạo assignments mới
        List<AssignmentBuildingEntity> newAssignments = new ArrayList<>();

        if (requestData.getStaffIds() != null) {
            for (Long staffId : requestData.getStaffIds()) {

                UserEntity staff = userRepository.findById(staffId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + staffId));

                AssignmentBuildingEntity assignment = new AssignmentBuildingEntity();
                assignment.setBuilding(building);
                assignment.setStaff(staff);
                newAssignments.add(assignment);
            }
        }

        //  Lưu assignments mới
        if (!newAssignments.isEmpty()) {
            List<AssignmentBuildingEntity> savedAssignments = assignmentBuildingRepository.saveAll(newAssignments);
        }
        System.out.println("=== DEBUG: Hoàn thành xử lý assignment ===");
    }

    @Override
    public void deleteByBuildingIds(List<Long> ids) {
        for(Long id : ids) {
            BuildingEntity buildingEntity = buildingRepository.findById(id).get();
            assignmentBuildingRepository.deleteByBuilding(buildingEntity);
        }
    }
}