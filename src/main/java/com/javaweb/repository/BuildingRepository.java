package com.javaweb.repository;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BuildingRepository extends JpaRepository<BuildingEntity,Long> {
BuildingEntity findById(long id);
    // Lấy danh sách building theo staffId (thông qua bảng assignmentbuilding)
    @Query("SELECT b FROM BuildingEntity b JOIN b.users u WHERE u.id = :staffId")
    List<BuildingEntity> findBuildingsByStaffId(@Param("staffId") Long staffId);

    // Hoặc dùng native query
    @Query(value = "SELECT b.* FROM building b " +
            "INNER JOIN assignmentbuilding a ON b.id = a.buildingid " +
            "WHERE a.staffid = :staffId",
            nativeQuery = true)
    List<BuildingEntity> findBuildingsByStaffIdNative(@Param("staffId") Long staffId);
}
