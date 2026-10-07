package com.sims.student_management_system.dto;

import java.util.List;

public class AcademicInformationResponse {

    private StudentProfileResponse profile;
    private List<?> enrollments;
    private List<?> attendance;
    private List<?> examinations;
    private List<?> results;

    public AcademicInformationResponse() {
    }

    public StudentProfileResponse getProfile() {
        return profile;
    }

    public void setProfile(StudentProfileResponse profile) {
        this.profile = profile;
    }

    public List<?> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<?> enrollments) {
        this.enrollments = enrollments;
    }

    public List<?> getAttendance() {
        return attendance;
    }

    public void setAttendance(List<?> attendance) {
        this.attendance = attendance;
    }

    public List<?> getExaminations() {
        return examinations;
    }

    public void setExaminations(List<?> examinations) {
        this.examinations = examinations;
    }

    public List<?> getResults() {
        return results;
    }

    public void setResults(List<?> results) {
        this.results = results;
    }
}