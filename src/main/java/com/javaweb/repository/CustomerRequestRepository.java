package com.javaweb.repository;

import com.javaweb.entity.CustomerRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRequestRepository extends JpaRepository<CustomerRequestEntity, Long> {

    // Lấy customer request theo staffId (thông qua bảng assignment_customer)
    @Query("SELECT cr FROM CustomerRequestEntity cr " +
            "WHERE cr.customer.id IN (" +
            "   SELECT ac.customer.id FROM AssignmentCustomerEntity ac " +
            "   WHERE ac.staff.id = :staffId" +
            ")")
    List<CustomerRequestEntity> findByStaffId(@Param("staffId") Long staffId);

    // Lấy customer request theo customerId
    List<CustomerRequestEntity> findByCustomerId(Long customerId);
    Optional<CustomerRequestEntity> findByCustomerIdAndDemandId(Long customerId, Long demandId);
}