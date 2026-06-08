package com.javaweb.model.response;

public class SendBuildingChatResponse {
    private ChatRoomResponse room;
    private ChatResponse message;

    public ChatRoomResponse getRoom() { return room; }
    public void setRoom(ChatRoomResponse room) { this.room = room; }
    public ChatResponse getMessage() { return message; }
    public void setMessage(ChatResponse message) { this.message = message; }
}
