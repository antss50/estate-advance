package com.javaweb.entity;

import javax.persistence.*;

@Entity
@Table(name = "assignmentbuilding")
public class AssignmentBuildingEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ ManyToOne với BuildingEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buildingid", nullable = false)
    private BuildingEntity building;

    // Quan hệ ManyToOne với UserEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staffid", nullable = false)
    private UserEntity staff;


    // Constructors
    public AssignmentBuildingEntity() {}

    public AssignmentBuildingEntity(BuildingEntity building, UserEntity staff) {
        this.building = building;
        this.staff = staff;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BuildingEntity getBuilding() { return building; }
    public void setBuilding(BuildingEntity building) { this.building = building; }
    public UserEntity getStaff() { return staff; }
    public void setStaff(UserEntity staff) { this.staff = staff; }
}