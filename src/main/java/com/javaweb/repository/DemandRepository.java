package com.javaweb.repository;

import com.javaweb.entity.DemandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<DemandEntity, Long> {

    List<DemandEntity> findByCustomerId(Long customerId);
}