package com.javaweb.api;

import com.javaweb.model.response.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatPresenceController {

    @Autowired private SimpMessagingTemplate messagingTemplate;

    private final Map<String, PresenceMeta> sessionMetaMap = new ConcurrentHashMap<>();

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("[Chat] Session connected: " + accessor.getSessionId());
    }

    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        if (destination == null || !destination.startsWith("/topic/rooms.")) return;

        String sessionId = accessor.getSessionId();
        String roomIdText = destination.replace("/topic/rooms.", "");
        Long roomId = Long.valueOf(roomIdText);
        String senderName = accessor.getFirstNativeHeader("senderName");
        if (senderName == null) senderName = "Nguoi dung";

        sessionMetaMap.put(sessionId, new PresenceMeta(roomId, senderName));
        messagingTemplate.convertAndSend("/topic/rooms." + roomId
                );
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        PresenceMeta meta = sessionMetaMap.remove(accessor.getSessionId());
        if (meta == null) return;
        messagingTemplate.convertAndSend("/topic/rooms." + meta.roomId
               );
    }

    private static class PresenceMeta {
        final Long roomId;
        final String senderName;
        PresenceMeta(Long roomId, String senderName) {
            this.roomId = roomId;
            this.senderName = senderName;
        }
    }
}
