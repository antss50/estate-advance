package com.javaweb.entity;

import javax.persistence.Embeddable;

@Embeddable
public class Demand {

    private Double area;     // diện tích
    private Double price;    // giá
    private String location; // vị trí

    public Demand() {}

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}