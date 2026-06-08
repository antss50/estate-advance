// ChatService.java
package com.javaweb.service;

import com.javaweb.model.request.BuildingCardRequest;
import com.javaweb.model.request.ChatRequest;
import com.javaweb.model.response.ChatResponse;
import java.util.List;

public interface ChatService {
    ChatResponse handleTextMessage(ChatRequest request);
    ChatResponse handleBuildingCard(BuildingCardRequest request);
    List<ChatResponse> getHistory(String roomId);
    List<ChatResponse> getLatestHistory(String roomId, int limit);

    static String buildRoomId(Long staffId, Long customerId) {
        return "staff_" + staffId + "_customer_" + customerId;
    }
}