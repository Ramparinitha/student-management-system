package com.sims.student_management_system.dto;

import com.sims.student_management_system.entity.Student;

public class StudentProfileResponse {

    private Long studentId;
    private String name;
    private String email;
    private String phone;
    private String status;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private String registrationDate;

    public StudentProfileResponse() {
    }

    public StudentProfileResponse(Student student) {

        this.studentId = student.getStudentId();
        this.name = student.getName();
        this.email = student.getEmail();
        this.phone = student.getPhone();
        this.status = student.getStatus();

        if (student.getDepartment() != null) {
            this.departmentId =
                    student.getDepartment().getDepartmentId();

            this.departmentName =
                    student.getDepartment().getDepartmentName();

            this.departmentCode =
                    student.getDepartment().getDepartmentCode();
        }

        if (student.getRegistrationDate() != null) {
            this.registrationDate =
                    student.getRegistrationDate().toString();
        }
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

    public String getPhone() {
        return phone;
    }

    public String getStatus() {
        return status;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public String getRegistrationDate() {
        return registrationDate;
    }
}