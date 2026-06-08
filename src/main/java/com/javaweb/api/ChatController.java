package com.javaweb.api;

import com.javaweb.model.request.ChatRequest;
import com.javaweb.model.response.ChatResponse;
import com.javaweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatRequest request) {
        ChatResponse response = chatService.handleTextMessage(request);
        messagingTemplate.convertAndSend("/topic/room." + response.getRoomId(), response);
    }
}