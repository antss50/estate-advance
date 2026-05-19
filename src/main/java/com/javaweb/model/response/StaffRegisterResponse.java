package com.javaweb.model.response;

public class StaffRegisterResponse {
    private Long id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String message;
    private boolean success;

    public StaffRegisterResponse() {}

    public StaffRegisterResponse(Long id, String userName, String fullName,
                                 String email, String phone, String message, boolean success) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.message = message;
        this.success = success;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}