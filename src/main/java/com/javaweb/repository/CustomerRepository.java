package com.javaweb.repository;

import com.javaweb.entity.CustomerEntity;
import com.javaweb.enums.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {

    Optional<CustomerEntity> findByUsername(String username);

    Optional<CustomerEntity> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);  // Thêm method này

    Optional<CustomerEntity> findByUsernameAndIsActive(String username, Integer isActive);

    // ── Dùng cho API thống kê ────────────────────────────────────────────────
    long countByIsActive(Integer isActive);
    long countByStatus(CustomerStatus status);
}