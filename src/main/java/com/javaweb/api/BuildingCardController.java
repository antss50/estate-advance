package com.javaweb.api;

import com.javaweb.model.request.BuildingCardRequest;
import com.javaweb.model.response.ChatResponse;
import com.javaweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class BuildingCardController {

    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private ChatService chatService;

    @MessageMapping({"/chat.building", "/chat.rooms.building"})
    public void sendBuildingCard(@Payload BuildingCardRequest request) {
        try {
            ChatResponse response = chatService.handleBuildingCard(request);
            messagingTemplate.convertAndSend("/topic/rooms." + response.getRoomId(), response);
        } catch (IllegalArgumentException e) {
            Long staffId = request.getStaffId() != null ? request.getStaffId() : request.getSenderId();
            messagingTemplate.convertAndSendToUser(
                    "staff_" + staffId, "/queue/errors",
                    "Khong gui duoc building card: " + e.getMessage());
        }
    }
}
