package com.javaweb.repository;

import com.javaweb.entity.AssignmentCustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssignmentCustomerRepository extends JpaRepository<AssignmentCustomerEntity, Long> {

    List<AssignmentCustomerEntity> findByStaff_Id(Long staffId);
    void deleteByCustomer_Id(Long customerId);
    List<AssignmentCustomerEntity> findByCustomer_Id(Long customerId);

    // ── Query mới: theo demand cụ thể ────────────────────────────────────────
    List<AssignmentCustomerEntity> findByCustomer_IdAndDemand_Id(Long customerId, Long demandId);

    void deleteByCustomer_IdAndDemand_Id(Long customerId, Long demandId);

    long countByStaff_Id(Long staffId);

    @Query("SELECT COUNT(DISTINCT a.customer.id) FROM AssignmentCustomerEntity a WHERE a.staff.id = :staffId")
    long countDistinctCustomersByStaffId(@Param("staffId") Long staffId);
}
