package com.javaweb.repository;

import com.javaweb.entity.ChatMessageEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    List<ChatMessageEntity> findByRoomIdOrderByCreatedDateAsc(Long roomId);

    List<ChatMessageEntity> findByRoomIdOrderByCreatedDateDesc(Long roomId, Pageable pageable);

    @Query("SELECT COUNT(m) FROM ChatMessageEntity m " +
            "WHERE m.roomId = :roomId AND m.senderId != :userId " +
            "AND m.createdDate > (SELECT COALESCE(MAX(m2.createdDate), '1970-01-01') " +
            "                     FROM ChatMessageEntity m2 " +
            "                     WHERE m2.roomId = :roomId AND m2.senderId = :userId)")
    long countUnread(@Param("roomId") Long roomId, @Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM ChatMessageEntity m " +
            "WHERE m.roomId = :roomId AND m.senderId != :userId " +
            "AND (:lastReadAt IS NULL OR m.createdDate > :lastReadAt)")
    long countUnreadAfter(@Param("roomId") Long roomId,
                          @Param("userId") Long userId,
                          @Param("lastReadAt") java.time.LocalDateTime lastReadAt);
}
