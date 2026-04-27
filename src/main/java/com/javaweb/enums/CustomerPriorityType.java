package com.javaweb.enums;

public enum CustomerPriorityType {
    DEFAULT("Mặc định", 0.4, 0.3, 0.2),
    SAVINGS("Tiết kiệm", 0.2, 0.6, 0.1),
    PROFIT("Tiền lợi", 0.6, 0.2, 0.1),
    SPACE("Không gian", 0.2, 0.2, 0.5);

    private final String name;
    private final double locationWeight;
    private final double priceWeight;
    private final double areaWeight;

    CustomerPriorityType(String name, double locationWeight, double priceWeight, double areaWeight) {
        this.name = name;
        this.locationWeight = locationWeight;
        this.priceWeight = priceWeight;
        this.areaWeight = areaWeight;
    }

    public String getName() { return name; }
    public double getLocationWeight() { return locationWeight; }
    public double getPriceWeight() { return priceWeight; }
    public double getAreaWeight() { return areaWeight; }

    public double getTotalWeight() {
        return locationWeight + priceWeight + areaWeight;
    }
}