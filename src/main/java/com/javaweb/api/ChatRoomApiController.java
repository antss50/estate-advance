package com.javaweb.api;

import com.javaweb.model.request.AddChatMembersRequest;
import com.javaweb.model.request.ChatRoomNameRequest;
import com.javaweb.model.request.SendBuildingToCustomerRequest;
import com.javaweb.model.response.ChatResponse;
import com.javaweb.model.response.ChatRoomResponse;
import com.javaweb.model.response.SendBuildingChatResponse;
import com.javaweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/chat/rooms", "/api/chat/room"})
public class ChatRoomApiController {

    @Autowired private ChatService chatService;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send-building")
    public ResponseEntity<?> sendBuildingToCustomer(
            @RequestBody SendBuildingToCustomerRequest request) {
        try {
            SendBuildingChatResponse response = chatService.sendBuildingToCustomer(request);
            messagingTemplate.convertAndSend("/topic/rooms." + response.getRoom().getId(), response.getMessage());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{roomId}/members")
    public ResponseEntity<ChatRoomResponse> addMembers(
            @PathVariable Long roomId,
            @RequestBody AddChatMembersRequest request) {
        return ResponseEntity.ok(chatService.addStaffMembers(roomId, request.getStaffIds()));
    }

    @DeleteMapping("/{roomId}/members")
    public ResponseEntity<ChatRoomResponse> removeMember(
            @PathVariable Long roomId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "STAFF") String userType) {
        return ResponseEntity.ok(chatService.removeMember(roomId, userId, userType));
    }

    @PatchMapping("/{roomId}/name")
    public ResponseEntity<ChatRoomResponse> renameRoom(
            @PathVariable Long roomId,
            @RequestBody ChatRoomNameRequest request) {
        return ResponseEntity.ok(chatService.renameRoom(roomId, request.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ChatRoomResponse>> myRooms(
            @RequestParam Long userId,
            @RequestParam String userType) {
        return ResponseEntity.ok(chatService.getMyRooms(userId, userType));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoomResponse> getRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getRoom(roomId));
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatResponse>> messages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(chatService.getLatestHistory(roomId, limit));
    }

    @PostMapping("/{roomId}/read")
    public ResponseEntity<ChatRoomResponse> markRead(
            @PathVariable Long roomId,
            @RequestParam Long userId,
            @RequestParam String userType) {
        return ResponseEntity.ok(chatService.markRead(roomId, userId, userType));
    }
}
