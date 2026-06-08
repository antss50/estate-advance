package com.javaweb.repository;

import com.javaweb.entity.ChatRoomMemberEntity;
import com.javaweb.enums.ChatSenderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMemberEntity, Long> {
    Optional<ChatRoomMemberEntity> findByRoom_IdAndUserIdAndUserTypeAndLeftAtIsNull(
            Long roomId, Long userId, ChatSenderType userType);

    List<ChatRoomMemberEntity> findByUserIdAndUserTypeAndLeftAtIsNullOrderByRoom_LastMessageAtDesc(
            Long userId, ChatSenderType userType);

    List<ChatRoomMemberEntity> findByRoom_IdAndLeftAtIsNull(Long roomId);
}
