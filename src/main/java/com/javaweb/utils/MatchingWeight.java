package com.javaweb.utils;

import com.javaweb.enums.CustomerPriorityType;

/**
 * Bảng trọng số (W) cho từng loại ưu tiên.
 *
 * Loại ưu tiên | W_Location | W_Price | W_Area
 * -------------|------------|---------|-------
 * DEFAULT      |    0.4     |   0.3   |  0.2
 * SAVING       |    0.2     |   0.6   |  0.1
 * CONVENIENT   |    0.6     |   0.2   |  0.1
 * SPACIOUS     |    0.2     |   0.2   |  0.5
 */
public class MatchingWeight {

    public final double wLocation;
    public final double wPrice;
    public final double wArea;

    private MatchingWeight(double wLocation, double wPrice, double wArea) {
        this.wLocation = wLocation;
        this.wPrice    = wPrice;
        this.wArea     = wArea;
    }

    public static MatchingWeight of(CustomerPriorityType type) {
        if (type == null) type = CustomerPriorityType.DEFAULT;
        switch (type) {
            case SAVING:     return new MatchingWeight(0.2, 0.6, 0.1);
            case CONVENIENT: return new MatchingWeight(0.6, 0.2, 0.1);
            case SPACIOUS:   return new MatchingWeight(0.2, 0.2, 0.5);
            default:         return new MatchingWeight(0.4, 0.3, 0.2);
        }
    }
}