package com.javaweb.model.request;

import java.util.ArrayList;
import java.util.List;

public class AddChatMembersRequest {
    private List<Long> staffIds = new ArrayList<>();

    public List<Long> getStaffIds() { return staffIds; }
    public void setStaffIds(List<Long> staffIds) { this.staffIds = staffIds; }
}
