package com.javaweb.repository;

import com.javaweb.entity.UserEntity;
import com.javaweb.repository.custom.UserRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> , UserRepositoryCustom {
    UserEntity findOneByUserNameAndStatus(String name, int status);
    Page<UserEntity> findByUserNameContainingIgnoreCaseOrFullNameContainingIgnoreCaseAndStatusNot(String userName, String fullName, int status,
                                                                                                  Pageable pageable);
    List<UserEntity> findByStatusAndRoles_Code(Integer status, String roleCode);
    Page<UserEntity> findByStatusNot(int status, Pageable pageable);
    long countByUserNameContainingIgnoreCaseOrFullNameContainingIgnoreCaseAndStatusNot(String userName, String fullName, int status);
    long countByStatusNot(int status);
    UserEntity findOneByUserName(String userName);
    List<UserEntity> findByIdIn(List<Long> id);
    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);
    Optional<UserEntity> findByUserName(String userName);

    Optional<UserEntity> findByEmail(String email);
    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE r.code = :code AND u.status = 1")
    List<UserEntity> findStaffs(@Param("code") String code);
    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE u.status = :status AND r.code = :roleCode")
    List<UserEntity> findByStatusAndRoleCode(@Param("status") Integer status, @Param("roleCode") String roleCode);
}
