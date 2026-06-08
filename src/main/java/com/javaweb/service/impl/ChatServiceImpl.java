package com.javaweb.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.converter.BuildingConverter;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.ChatMessageEntity;
import com.javaweb.entity.ChatRoomEntity;
import com.javaweb.entity.ChatRoomMemberEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.enums.ChatMemberRole;
import com.javaweb.enums.ChatMessageType;
import com.javaweb.enums.ChatRoomStatus;
import com.javaweb.enums.ChatSenderType;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingCardRequest;
import com.javaweb.model.request.ChatRequest;
import com.javaweb.model.request.SendBuildingToCustomerRequest;
import com.javaweb.model.response.BuildingCardPayload;
import com.javaweb.model.response.ChatResponse;
import com.javaweb.model.response.ChatRoomMemberResponse;
import com.javaweb.model.response.ChatRoomResponse;
import com.javaweb.model.response.SendBuildingChatResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.ChatMessageRepository;
import com.javaweb.repository.ChatRoomMemberRepository;
import com.javaweb.repository.ChatRoomRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired private ChatMessageRepository chatMessageRepository;
    @Autowired private ChatRoomRepository chatRoomRepository;
    @Autowired private ChatRoomMemberRepository chatRoomMemberRepository;
    @Autowired private BuildingRepository buildingRepository;
    @Autowired private BuildingConverter buildingConverter;
    @Autowired private UserRepository userRepository;
    @Autowired private CustomerRepository customerRepository;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    @Transactional
    public ChatResponse handleTextMessage(ChatRequest request) {
        Long roomId = resolveRoomId(request.getRoomId(), request.getStaffId(), request.getCustomerId(), request.getSenderId());
        ChatSenderType senderType = ChatSenderType.valueOf(request.getSenderType());
        requireActiveMember(roomId, request.getSenderId(), senderType);

        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomId(roomId);
        entity.setSenderId(request.getSenderId());
        entity.setSenderType(senderType);
        entity.setSenderName(request.getSenderName());
        entity.setType(ChatMessageType.TEXT);
        entity.setContent(request.getContent());
        entity = chatMessageRepository.save(entity);
        touchRoom(roomId, entity.getCreatedDate());
        return toResponse(entity);
    }

    @Override
    @Transactional
    public ChatResponse handleBuildingCard(BuildingCardRequest request) {
        Long senderId = request.getSenderId() != null ? request.getSenderId() : request.getStaffId();
        Long roomId = resolveRoomId(request.getRoomId(), request.getStaffId(), request.getCustomerId(), senderId);
        requireActiveMember(roomId, senderId, ChatSenderType.STAFF);
        return saveBuildingCards(roomId, senderId, request.getBuildingId(), request.getNote());
    }

    @Override
    @Transactional
    public SendBuildingChatResponse sendBuildingToCustomer(SendBuildingToCustomerRequest request) {
        ChatRoomEntity room = getOrCreateCustomerRoom(request.getCustomerId(), request.getCreatedByStaffId());
        addMember(room, request.getCreatedByStaffId(), ChatSenderType.STAFF, ChatMemberRole.OWNER);

        List<Long> staffIds = request.getStaffIds();
        if (staffIds != null) {
            for (Long staffId : staffIds) {
                addMember(room, staffId, ChatSenderType.STAFF,
                        staffId.equals(request.getCreatedByStaffId()) ? ChatMemberRole.OWNER : ChatMemberRole.MEMBER);
            }
        }

        ChatResponse message = saveBuildingCards(room.getId(), request.getCreatedByStaffId(),
                request.getBuildingId(), request.getNote());

        SendBuildingChatResponse response = new SendBuildingChatResponse();
        response.setRoom(toRoomResponse(room, request.getCreatedByStaffId(), ChatSenderType.STAFF));
        response.setMessage(message);
        return response;
    }

    @Override
    @Transactional
    public ChatRoomResponse addStaffMembers(Long roomId, List<Long> staffIds) {
        ChatRoomEntity room = findRoom(roomId);
        if (staffIds != null) {
            for (Long staffId : staffIds) {
                addMember(room, staffId, ChatSenderType.STAFF, ChatMemberRole.MEMBER);
            }
        }
        return toRoomResponse(room, null, null);
    }

    @Override
    @Transactional
    public ChatRoomResponse removeMember(Long roomId, Long userId, String userType) {
        ChatSenderType type = ChatSenderType.valueOf(userType);
        if (type == ChatSenderType.CUSTOMER) {
            throw new IllegalArgumentException("Khong the xoa CUSTOMER khoi room, customer la chu phong");
        }
        ChatRoomMemberEntity member = chatRoomMemberRepository
                .findByRoom_IdAndUserIdAndUserTypeAndLeftAtIsNull(roomId, userId, type)
                .orElseThrow(() -> new IllegalArgumentException("Member khong ton tai trong room"));
        member.setLeftAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member);
        return toRoomResponse(member.getRoom(), null, null);
    }

    @Override
    @Transactional
    public ChatRoomResponse renameRoom(Long roomId, String name) {
        ChatRoomEntity room = findRoom(roomId);
        String normalized = name == null ? null : name.trim();
        room.setName(normalized == null || normalized.isEmpty() ? null : normalized);
        room = chatRoomRepository.save(room);
        return toRoomResponse(room, null, null);
    }

    @Override
    @Transactional
    public ChatRoomResponse markRead(Long roomId, Long userId, String userType) {
        ChatSenderType type = ChatSenderType.valueOf(userType);
        if (type == ChatSenderType.CUSTOMER) {
            ChatRoomEntity room = findRoom(roomId);
            if (!room.getCustomerId().equals(userId)) {
                throw new IllegalArgumentException("Customer khong phai member cua room");
            }
            return toRoomResponse(room, userId, type);
        }
        ChatRoomMemberEntity member = requireActiveMember(roomId, userId, type);
        member.setLastReadAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member);
        return toRoomResponse(member.getRoom(), userId, type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getMyRooms(Long userId, String userType) {
        ChatSenderType type = ChatSenderType.valueOf(userType);
        if (type == ChatSenderType.CUSTOMER) {
            return chatRoomRepository.findByCustomerIdAndStatusOrderByLastMessageAtDesc(userId, ChatRoomStatus.ACTIVE)
                    .stream()
                    .map(room -> toRoomResponse(room, userId, type))
                    .collect(Collectors.toList());
        }
        return chatRoomMemberRepository
                .findByUserIdAndUserTypeAndLeftAtIsNullOrderByRoom_LastMessageAtDesc(userId, type)
                .stream()
                .map(member -> toRoomResponse(member.getRoom(), userId, type))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ChatRoomResponse getRoom(Long roomId) {
        return toRoomResponse(findRoom(roomId), null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatResponse> getHistory(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderByCreatedDateAsc(roomId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatResponse> getLatestHistory(Long roomId, int limit) {
        List<ChatResponse> list = chatMessageRepository
                .findByRoomIdOrderByCreatedDateDesc(roomId, PageRequest.of(0, limit))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        Collections.reverse(list);
        return list;
    }

    private Long resolveRoomId(Long roomId, Long staffId, Long customerId, Long senderId) {
        if (roomId != null) return roomId;
        if (staffId == null || customerId == null) {
            throw new IllegalArgumentException("roomId hoac staffId/customerId bat buoc co");
        }
        return getOrCreateCustomerRoom(customerId, staffId != null ? staffId : senderId).getId();
    }

    private ChatRoomEntity getOrCreateCustomerRoom(Long customerId, Long staffId) {
        if (!customerRepository.existsById(customerId)) {
            throw new IllegalArgumentException("Customer khong ton tai: id=" + customerId);
        }
        if (!userRepository.existsById(staffId)) {
            throw new IllegalArgumentException("Staff khong ton tai: id=" + staffId);
        }

        Optional<ChatRoomEntity> existing =
                chatRoomRepository.findFirstByCustomerIdAndStatusOrderByIdDesc(customerId, ChatRoomStatus.ACTIVE);
        if (existing.isPresent()) return existing.get();

        ChatRoomEntity room = new ChatRoomEntity();
        room.setCustomerId(customerId);
        room.setCreatedByStaffId(staffId);
        room.setStatus(ChatRoomStatus.ACTIVE);
        room.setCreatedDate(LocalDateTime.now());
        room = chatRoomRepository.save(room);
        room.setRoomCode("room_" + room.getId());
        return chatRoomRepository.save(room);
    }

    private void addMember(ChatRoomEntity room, Long userId, ChatSenderType userType, ChatMemberRole role) {
        if (userId == null) {
            throw new IllegalArgumentException("staffId khong duoc null");
        }
        if (userType != ChatSenderType.STAFF) {
            throw new IllegalArgumentException("chat_room_member chi luu STAFF, khong luu CUSTOMER");
        }
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Staff khong ton tai trong bang user: id=" + userId);
        }

        Optional<ChatRoomMemberEntity> existing =
                chatRoomMemberRepository.findByRoom_IdAndUserIdAndUserTypeAndLeftAtIsNull(room.getId(), userId, userType);
        if (existing.isPresent()) return;

        ChatRoomMemberEntity member = new ChatRoomMemberEntity();
        member.setRoom(room);
        member.setRoomId(room.getId());
        member.setUserId(userId);
        member.setUserType(userType);
        member.setRole(role);
        member.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member);
    }

    private ChatRoomMemberEntity requireActiveMember(Long roomId, Long userId, ChatSenderType userType) {
        ChatRoomEntity room = findRoom(roomId);
        if (userType == ChatSenderType.CUSTOMER) {
            if (room.getCustomerId().equals(userId)) return null;
            throw new IllegalArgumentException("Customer khong phai member cua room");
        }
        return chatRoomMemberRepository.findByRoom_IdAndUserIdAndUserTypeAndLeftAtIsNull(roomId, userId, userType)
                .orElseThrow(() -> new IllegalArgumentException("User khong phai member cua room"));
    }

    private ChatRoomEntity findRoom(Long roomId) {
        ChatRoomEntity room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room khong ton tai: id=" + roomId));
        if (room.getStatus() != ChatRoomStatus.ACTIVE) {
            throw new IllegalArgumentException("Room da dong: id=" + roomId);
        }
        return room;
    }

    private ChatResponse saveBuildingCards(Long roomId, Long staffId, List<Long> buildingIds, String note) {
        if (buildingIds == null || buildingIds.isEmpty()) {
            throw new IllegalArgumentException("buildingId bat buoc co it nhat 1 id");
        }

        List<BuildingDTO> payload = new ArrayList<>();
        for (Long buildingId : buildingIds) {
            BuildingEntity building = buildingRepository.findById(buildingId)
                    .orElseThrow(() -> new IllegalArgumentException("Building khong ton tai: id=" + buildingId));
            BuildingDTO dto = buildingConverter.convertToDTO(building);
            dto.setNote(note != null ? note : dto.getNote());
            payload.add(dto);
        }

        String payloadJson = toJson(payload);
        String staffName = getStaffName(staffId);

        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomId(roomId);
        entity.setSenderId(staffId);
        entity.setSenderType(ChatSenderType.STAFF);
        entity.setSenderName(staffName);
        entity.setType(ChatMessageType.BUILDING_CARD);
        entity.setPayload(payloadJson);
        entity = chatMessageRepository.save(entity);
        touchRoom(roomId, entity.getCreatedDate());
        return toResponse(entity);
    }

    private void touchRoom(Long roomId, LocalDateTime time) {
        ChatRoomEntity room = findRoom(roomId);
        room.setLastMessageAt(time);
        chatRoomRepository.save(room);
    }

    private ChatRoomResponse toRoomResponse(ChatRoomEntity room, Long viewerId, ChatSenderType viewerType) {
        ChatRoomResponse response = new ChatRoomResponse();
        response.setId(room.getId());
        response.setRoomCode(room.getRoomCode());
        response.setCustomerId(room.getCustomerId());
        response.setCreatedByStaffId(room.getCreatedByStaffId());
        response.setStatus(room.getStatus());
        response.setCreatedDate(room.getCreatedDate());
        response.setLastMessageAt(room.getLastMessageAt());

        List<ChatRoomMemberResponse> members = new ArrayList<>();
        members.add(toCustomerMemberResponse(room.getCustomerId()));
        for (ChatRoomMemberEntity member : chatRoomMemberRepository.findByRoom_IdAndLeftAtIsNull(room.getId())) {
            members.add(toMemberResponse(member));
            if (viewerId != null && viewerType != null
                    && viewerId.equals(member.getUserId()) && viewerType == member.getUserType()) {
                response.setUnreadCount(chatMessageRepository.countUnreadAfter(
                        room.getId(), viewerId, member.getLastReadAt()));
            }
        }
        response.setMembers(members);
        response.setName(resolveRoomName(room, members));

        List<ChatResponse> latest = getLatestHistory(room.getId(), 1);
        if (!latest.isEmpty()) response.setLastMessage(latest.get(0));
        return response;
    }

    private ChatRoomMemberResponse toCustomerMemberResponse(Long customerId) {
        ChatRoomMemberResponse response = new ChatRoomMemberResponse();
        response.setUserId(customerId);
        response.setDisplayName(getCustomerName(customerId));
        response.setUserType(ChatSenderType.CUSTOMER);
        response.setRole(ChatMemberRole.CUSTOMER);
        return response;
    }

    private ChatRoomMemberResponse toMemberResponse(ChatRoomMemberEntity member) {
        ChatRoomMemberResponse response = new ChatRoomMemberResponse();
        response.setUserId(member.getUserId());
        response.setDisplayName(getStaffName(member.getUserId()));
        response.setUserType(member.getUserType());
        response.setRole(member.getRole());
        response.setJoinedAt(member.getJoinedAt());
        response.setLastReadAt(member.getLastReadAt());
        return response;
    }

    private String resolveRoomName(ChatRoomEntity room, List<ChatRoomMemberResponse> members) {
        if (room.getName() != null && !room.getName().trim().isEmpty()) {
            return room.getName();
        }
        return members.stream()
                .map(ChatRoomMemberResponse::getDisplayName)
                .filter(name -> name != null && !name.trim().isEmpty())
                .collect(Collectors.joining(", "));
    }

    private ChatResponse toResponse(ChatMessageEntity entity) {
        if (entity.getType() == ChatMessageType.BUILDING_CARD) {
            return ChatResponse.ofBuildings(
                    entity.getId(),
                    entity.getRoomId(),
                    entity.getSenderId(),
                    entity.getSenderName(),
                    fromJsonList(entity.getPayload()),
                    entity.getCreatedDate()
            );
        }
        if (entity.getType() == ChatMessageType.SYSTEM) {
            return ChatResponse.ofSystem(entity.getRoomId(), entity.getContent());
        }
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

    private BuildingCardPayload mapToPayload(BuildingEntity building, String note) {
        BuildingCardPayload payload = new BuildingCardPayload();
        payload.setBuildingId(building.getId());
        payload.setBuildingName(building.getName());
        payload.setAddress(building.getFullAddress());
        payload.setDistrict(building.getDistrictLegacy());
        payload.setRentPrice(building.getRentPrice());
        payload.setRentPriceUnit("nghin/m2");
        Double floorArea = building.getFloorArea();
        payload.setArea(floorArea != null ? floorArea.intValue() : null);
        payload.setThumbnailUrl(building.getAvatar());
        payload.setNote(note);
        return payload;
    }

    private String getStaffName(Long staffId) {
        Optional<UserEntity> user = userRepository.findById(staffId);
        return user.isPresent() ? user.get().getFullName() : "Staff #" + staffId;
    }

    private String getCustomerName(Long customerId) {
        Optional<CustomerEntity> customer = customerRepository.findById(customerId);
        return customer.isPresent() ? customer.get().getFullName() : "Customer #" + customerId;
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Khong the serialize payload thanh JSON", e);
        }
    }

    private BuildingCardPayload fromJson(String json) {
        try {
            return objectMapper.readValue(json, BuildingCardPayload.class);
        } catch (IOException e) {
            throw new RuntimeException("Khong the deserialize JSON payload", e);
        }
    }

    private List<BuildingDTO> fromJsonList(String json) {
        try {
            if (json != null && json.trim().startsWith("[")) {
                return objectMapper.readValue(json, new TypeReference<List<BuildingDTO>>() {});
            }
            BuildingDTO dto = objectMapper.readValue(json, BuildingDTO.class);
            List<BuildingDTO> result = new ArrayList<>();
            result.add(dto);
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Khong the deserialize JSON payload", e);
        }
    }
}
