package com.sims.student_management_system.dto;

import java.util.List;

public class StudentDashboardResponse {

    private StudentProfileResponse profile;

    private List<?> enrollments;

    private List<?> attendance;

    private List<?> examinations;

    private List<?> results;

    private double attendancePercentage;

    private long totalCourses;

    private long totalAttendanceRecords;

    private long totalExaminations;

    private long totalResults;

    public StudentDashboardResponse() {
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

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalAttendanceRecords() {
        return totalAttendanceRecords;
    }

    public void setTotalAttendanceRecords(long totalAttendanceRecords) {
        this.totalAttendanceRecords = totalAttendanceRecords;
    }

    public long getTotalExaminations() {
        return totalExaminations;
    }

    public void setTotalExaminations(long totalExaminations) {
        this.totalExaminations = totalExaminations;
    }

    public long getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }
}