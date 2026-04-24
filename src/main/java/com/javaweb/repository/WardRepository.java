package com.javaweb.repository;

import com.javaweb.entity.WardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WardRepository extends JpaRepository<WardEntity, Long> {
    List<WardEntity> findAllByIsActiveTrue();
    Optional<WardEntity> findByCode(String code);

    @Query("SELECT w FROM WardEntity w WHERE w.province.code = :provinceCode AND w.isActive = true ORDER BY w.name")
    List<WardEntity> findActiveByProvinceCode(@Param("provinceCode") String provinceCode);
}