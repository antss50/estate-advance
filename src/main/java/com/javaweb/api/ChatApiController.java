package com.javaweb.api;

import com.javaweb.model.response.ChatResponse;
import com.javaweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatApiController {

    @Autowired private ChatService chatService;

    @GetMapping("/history/{roomId}")
    public ResponseEntity<List<ChatResponse>> getHistory(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getHistory(roomId));
    }

    @GetMapping("/history/{roomId}/latest")
    public ResponseEntity<List<ChatResponse>> getLatestHistory(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(chatService.getLatestHistory(roomId, limit));
    }
}