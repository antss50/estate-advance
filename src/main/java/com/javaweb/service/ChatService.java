// ChatService.java
package com.javaweb.service;

import com.javaweb.model.request.BuildingCardRequest;
import com.javaweb.model.request.ChatRequest;
import com.javaweb.model.request.SendBuildingToCustomerRequest;
import com.javaweb.model.response.ChatResponse;
import com.javaweb.model.response.ChatRoomResponse;
import com.javaweb.model.response.SendBuildingChatResponse;
import java.util.List;

public interface ChatService {
    ChatResponse handleTextMessage(ChatRequest request);
    ChatResponse handleBuildingCard(BuildingCardRequest request);
    SendBuildingChatResponse sendBuildingToCustomer(SendBuildingToCustomerRequest request);
    ChatRoomResponse addStaffMembers(Long roomId, List<Long> staffIds);
    ChatRoomResponse removeMember(Long roomId, Long userId, String userType);
    ChatRoomResponse renameRoom(Long roomId, String name);
    ChatRoomResponse markRead(Long roomId, Long userId, String userType);
    List<ChatRoomResponse> getMyRooms(Long userId, String userType);
    List<ChatResponse> getHistory(Long roomId);
    List<ChatResponse> getLatestHistory(Long roomId, int limit);

    ChatRoomResponse getRoom(Long roomId);
}
