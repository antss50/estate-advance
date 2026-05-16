package com.javaweb.model.response;

public class CustomerRegisterResponse {
    private Long id;
    private String username;
    private String fullName;
    private String phone;
    private String email;
    private String message;
    private boolean success;

    public CustomerRegisterResponse() {}

    public CustomerRegisterResponse(Long id, String username, String fullName, String phone, String email, String message, boolean success) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.message = message;
        this.success = success;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}