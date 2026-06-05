package com.javaweb.repository;

import com.javaweb.entity.WardAdjacencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WardAdjacencyRepository
        extends JpaRepository<WardAdjacencyEntity, WardAdjacencyEntity.WardAdjacencyId> {

    // ── Query theo mã phường ──────────────────────────────────────────────────
    @Query("SELECT COUNT(w) > 0 FROM WardAdjacencyEntity w " +
            "WHERE w.id.wardCodeA = :a AND w.id.wardCodeB = :b")
    boolean existsByWardCodeAAndWardCodeB(
            @Param("a") String wardCodeA,
            @Param("b") String wardCodeB);

    // ── Query theo tên phường (client gửi tên lên) ────────────────────────────
    @Query("SELECT COUNT(w) > 0 FROM WardAdjacencyEntity w " +
            "WHERE LOWER(w.wardNameA) = LOWER(:a) AND LOWER(w.wardNameB) = LOWER(:b)")
    boolean existsByWardNameAAndWardNameB(
            @Param("a") String wardNameA,
            @Param("b") String wardNameB);
}