package com.javaweb.enums;

public enum LiquidityStatus {
    NEW("Building mới (< 6 tháng)", 0.2),
    INVENTORY("Building trên kho (> 6 tháng)", 0.8);

    private final String name;
    private final double score;

    LiquidityStatus(String name, double score) {
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public double getScore() { return score; }
}