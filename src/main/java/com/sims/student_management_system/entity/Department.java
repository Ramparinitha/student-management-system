package com.sims.student_management_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long departmentId;

    @NotBlank(message = "Department name is required")
    @Size(
        min = 2,
        max = 100,
        message = "Department name must be between 2 and 100 characters"
    )
    @Column(nullable = false, unique = true)
    private String departmentName;

    @NotBlank(message = "Department code is required")
    @Size(
        min = 2,
        max = 20,
        message = "Department code must be between 2 and 20 characters"
    )
    @Column(nullable = false, unique = true)
    private String departmentCode;

    @NotBlank(message = "Department status is required")
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Department() {
    }

    public Department(
            String departmentName,
            String departmentCode) {

        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.status = "ACTIVE";
    }

    @PrePersist
    public void setCreatedAt() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null || status.isBlank()) {
            status = "ACTIVE";
        }
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}