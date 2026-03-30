package com.javaweb.repository;

import com.javaweb.entity.AssignmentCustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentCustomerRepository extends JpaRepository<AssignmentCustomerEntity, Long> {

    List<AssignmentCustomerEntity> findByStaff_Id(Long staffId);
    void deleteByCustomer_Id(Long customerId);
    List<AssignmentCustomerEntity> findByCustomer_Id(Long customerId);
}