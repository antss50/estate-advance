package com.javaweb.repository;

import com.javaweb.entity.ProvinceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinceRepository extends JpaRepository<ProvinceEntity, Long> {
    List<ProvinceEntity> findAllByIsActiveTrue();
    Optional<ProvinceEntity> findByCode(String code);
    Optional<ProvinceEntity> findByName(String name);

    @Query("SELECT p FROM ProvinceEntity p WHERE p.isActive = true ORDER BY p.name")
    List<ProvinceEntity> findAllActiveOrderByName();
}