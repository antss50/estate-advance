package com.javaweb.repository;

import com.javaweb.entity.CustomerRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRequestRepository extends JpaRepository<CustomerRequestEntity, Long> {
}