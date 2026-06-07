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

    // ── Query cũ ─────────────────────────────────────────────────────────────
    @Query("SELECT cr FROM CustomerRequestEntity cr " +
            "WHERE cr.customer.id IN (" +
            "   SELECT ac.customer.id FROM AssignmentCustomerEntity ac " +
            "   WHERE ac.staff.id = :staffId" +
            ")")
    List<CustomerRequestEntity> findByStaffId(@Param("staffId") Long staffId);

    List<CustomerRequestEntity> findByCustomerId(Long customerId);

    // ── THÊM MỚI: tìm theo customerId + demandId ─────────────────────────────
    // Dùng trong CustomerStatusService.updateStatus()
    @Query("SELECT cr FROM CustomerRequestEntity cr " +
            "WHERE cr.customer.id = :customerId " +
            "AND cr.demand.id = :demandId")
    Optional<CustomerRequestEntity> findByCustomerIdAndDemandId(
            @Param("customerId") Long customerId,
            @Param("demandId")   Long demandId);
}