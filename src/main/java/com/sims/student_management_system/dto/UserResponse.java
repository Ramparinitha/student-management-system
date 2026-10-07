package com.sims.student_management_system.dto;

import com.sims.student_management_system.entity.User;

import java.time.LocalDateTime;

public class UserResponse {

    private Long userId;
    private Long studentId;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public UserResponse() {
    }

    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
    }

    public UserResponse(User user, Long studentId) {
        this.userId = user.getUserId();
        this.studentId = studentId;
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
    }

    public Long getUserId() {
        return userId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}