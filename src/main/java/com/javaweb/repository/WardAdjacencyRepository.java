package com.javaweb.repository;

import com.javaweb.entity.WardAdjacencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WardAdjacencyRepository
        extends JpaRepository<WardAdjacencyEntity, WardAdjacencyEntity.WardAdjacencyId> {

    /**
     * Kiểm tra 2 xã/phường có lân cận nhau không.
     * Vì lưu 2 chiều (A,B) và (B,A) nên chỉ cần 1 query.
     *
     * @return true nếu tồn tại bản ghi → 2 xã chạm nhau
     */
    @Query("SELECT COUNT(w) > 0 FROM WardAdjacencyEntity w " +
            "WHERE w.id.wardCodeA = :a AND w.id.wardCodeB = :b")
    boolean existsByWardCodeAAndWardCodeB(
            @Param("a") String wardCodeA,
            @Param("b") String wardCodeB);
}