package com.javaweb.repository;

import com.javaweb.entity.AssignmentBuildingEntity;
import com.javaweb.entity.BuildingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AssignmentBuildingRepository extends JpaRepository<AssignmentBuildingEntity,Long> {
    // Query 1: Tìm danh sách assignment theo buildingId
    @Query("SELECT a FROM AssignmentBuildingEntity a WHERE a.building.id = :buildingId")
    List<AssignmentBuildingEntity> findByBuildingId(@Param("buildingId") Long buildingId);

    void deleteByBuilding(BuildingEntity buildingEntity);
}
