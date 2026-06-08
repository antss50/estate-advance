package com.javaweb.repository;

import com.javaweb.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    List<ChatMessageEntity> findByRoomIdOrderByCreatedDateAsc(String roomId);

    @Query(value = "SELECT * FROM chat_message WHERE room_id = :roomId " +
            "ORDER BY created_date DESC LIMIT :limit",
            nativeQuery = true)
    List<ChatMessageEntity> findLatestByRoomId(
            @Param("roomId") String roomId,
            @Param("limit")  int limit);

    @Query("SELECT COUNT(m) FROM ChatMessageEntity m " +
            "WHERE m.roomId = :roomId AND m.senderId != :userId " +
            "AND m.createdDate > (SELECT COALESCE(MAX(m2.createdDate), '1970-01-01') " +
            "                     FROM ChatMessageEntity m2 " +
            "                     WHERE m2.roomId = :roomId AND m2.senderId = :userId)")
    long countUnread(@Param("roomId") String roomId, @Param("userId") Long userId);
}