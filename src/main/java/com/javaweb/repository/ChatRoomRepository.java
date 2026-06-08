package com.javaweb.repository;

import com.javaweb.entity.ChatRoomEntity;
import com.javaweb.enums.ChatRoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {
    Optional<ChatRoomEntity> findFirstByCustomerIdAndStatusOrderByIdDesc(Long customerId, ChatRoomStatus status);
    List<ChatRoomEntity> findByCustomerIdAndStatusOrderByLastMessageAtDesc(Long customerId, ChatRoomStatus status);
}
