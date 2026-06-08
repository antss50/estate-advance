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
        if (destination == null || !destination.startsWith("/topic/room.")) return;

        String sessionId  = accessor.getSessionId();
        String roomId     = destination.replace("/topic/room.", "");
        String senderName = accessor.getFirstNativeHeader("senderName");
        if (senderName == null) senderName = "Người dùng";

        sessionMetaMap.put(sessionId, new PresenceMeta(roomId, senderName));
        messagingTemplate.convertAndSend("/topic/room." + roomId,
                ChatResponse.ofSystem(roomId, senderName + " đã vào phòng chat"));
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        PresenceMeta meta = sessionMetaMap.remove(accessor.getSessionId());
        if (meta == null) return;
        messagingTemplate.convertAndSend("/topic/room." + meta.roomId,
                ChatResponse.ofSystem(meta.roomId, meta.senderName + " đã offline"));
    }

    private static class PresenceMeta {
        final String roomId;
        final String senderName;
        PresenceMeta(String roomId, String senderName) {
            this.roomId = roomId; this.senderName = senderName;
        }
    }
}