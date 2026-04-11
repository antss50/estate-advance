package com.javaweb.enums;

public enum CustomerStatus {
    NEW("New"),
    ASSIGNED("Assigned"),
    IN_PROGRESS("In Progress"),
    SIGNED("Signed"),
    PAID("Paid");

    private final String displayName;

    CustomerStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CustomerStatus fromDisplayName(String displayName) {
        for (CustomerStatus status : CustomerStatus.values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + displayName);
    }
}