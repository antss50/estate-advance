package com.javaweb.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.ChatMessageEntity;
import com.javaweb.enums.ChatMessageType;
import com.javaweb.enums.ChatSenderType;
import com.javaweb.model.request.BuildingCardRequest;
import com.javaweb.model.request.ChatRequest;
import com.javaweb.model.response.BuildingCardPayload;
import com.javaweb.model.response.ChatResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.ChatMessageRepository;
import com.javaweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    /**
     * ObjectMapper dùng để serialize/deserialize JSON payload (Building card).
     * Khai báo là field để tái sử dụng (thread-safe sau khi configured).
     */
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ────────────────────────────────────────────────────────────────────────
    // TEXT MESSAGE
    // ────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ChatResponse handleTextMessage(ChatRequest request) {
        String roomId = ChatService.buildRoomId(request.getStaffId(), request.getCustomerId());

        // 1. Lưu entity vào DB
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomId(roomId);
        entity.setSenderId(request.getSenderId());
        entity.setSenderType(ChatSenderType.valueOf(request.getSenderType()));
        entity.setSenderName(request.getSenderName());
        entity.setType(ChatMessageType.TEXT);
        entity.setContent(request.getContent());

        entity = chatMessageRepository.save(entity);

        // 2. Map sang ChatResponse để broadcast
        return ChatResponse.ofText(
                entity.getId(),
                entity.getRoomId(),
                entity.getSenderId(),
                entity.getSenderType(),
                entity.getSenderName(),
                entity.getContent(),
                entity.getCreatedDate()
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // BUILDING CARD
    // ────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ChatResponse handleBuildingCard(BuildingCardRequest request) {
        String roomId = ChatService.buildRoomId(request.getStaffId(), request.getCustomerId());

        // 1. Lookup Building — ném exception nếu không tồn tại
        BuildingEntity building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Building không tồn tại: id=" + request.getBuildingId()));

        // 2. Map BuildingEntity → BuildingCardPayload
        BuildingCardPayload payload = mapToPayload(building, request.getNote());

        // 3. Serialize payload → JSON string để lưu DB
        String payloadJson = toJson(payload);

        // 4. Lưu entity
        // Staff name: lấy từ StaffEntity nếu cần — hiện dùng staffId làm senderName tạm
        String staffName = "Staff #" + request.getStaffId();  // TODO: inject StaffRepository nếu cần

        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomId(roomId);
        entity.setSenderId(request.getStaffId());
        entity.setSenderType(ChatSenderType.STAFF);
        entity.setSenderName(staffName);
        entity.setType(ChatMessageType.BUILDING_CARD);
        entity.setPayload(payloadJson);

        entity = chatMessageRepository.save(entity);

        // 5. Trả về ChatResponse
        return ChatResponse.ofBuilding(
                entity.getId(),
                entity.getRoomId(),
                entity.getSenderId(),
                entity.getSenderName(),
                payload,
                entity.getCreatedDate()
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // HISTORY
    // ────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ChatResponse> getHistory(String roomId) {
        return chatMessageRepository
                .findByRoomIdOrderByCreatedDateAsc(roomId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatResponse> getLatestHistory(String roomId, int limit) {
        List<ChatResponse> list = chatMessageRepository
                .findLatestByRoomId(roomId, limit)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        // findLatestByRoomId trả về DESC → đảo lại thành ASC cho frontend
        Collections.reverse(list);
        return list;
    }

    // ────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Map ChatMessageEntity → ChatResponse.
     * Xử lý cả 3 loại: TEXT, BUILDING_CARD, SYSTEM.
     */
    private ChatResponse toResponse(ChatMessageEntity entity) {
        if (entity.getType() == ChatMessageType.BUILDING_CARD) {
            BuildingCardPayload payload = fromJson(entity.getPayload());
            return ChatResponse.ofBuilding(
                    entity.getId(),
                    entity.getRoomId(),
                    entity.getSenderId(),
                    entity.getSenderName(),
                    payload,
                    entity.getCreatedDate()
            );
        } else if (entity.getType() == ChatMessageType.SYSTEM) {
            return ChatResponse.ofSystem(entity.getRoomId(), entity.getContent());
        } else {
            // TEXT (default)
            return ChatResponse.ofText(
                    entity.getId(),
                    entity.getRoomId(),
                    entity.getSenderId(),
                    entity.getSenderType(),
                    entity.getSenderName(),
                    entity.getContent(),
                    entity.getCreatedDate()
            );
        }
    }

    /**
     * Map BuildingEntity → BuildingCardPayload.
     * Điều chỉnh field name theo BuildingEntity thực tế trong project.
     */
    private BuildingCardPayload mapToPayload(BuildingEntity building, String note) {
        BuildingCardPayload payload = new BuildingCardPayload();
        payload.setBuildingId(building.getId());
        payload.setBuildingName(building.getName());

        // Dùng getFullAddress() có sẵn trong BuildingEntity
        // → ghép street + wardName + provinceName
        payload.setAddress(building.getFullAddress());

        // districtLegacy là field quận/huyện hiện tại (district đã đổi tên)
        payload.setDistrict(building.getDistrictLegacy());

        // rentPrice là Double trong entity
        payload.setRentPrice(building.getRentPrice());
        payload.setRentPriceUnit("nghìn/m²");

        // floorArea là Double → ép về Integer (m² không cần thập phân)
        Double floorArea = building.getFloorArea();
        payload.setArea(floorArea != null ? floorArea.intValue() : null);

        // avatar là ảnh đại diện của Building
        payload.setThumbnailUrl(building.getAvatar());

        payload.setNote(note);
        return payload;
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Không thể serialize payload thành JSON", e);
        }
    }

    private BuildingCardPayload fromJson(String json) {
        try {
            return objectMapper.readValue(json, BuildingCardPayload.class);
        } catch (IOException e) {
            throw new RuntimeException("Không thể deserialize JSON payload", e);
        }
    }
}