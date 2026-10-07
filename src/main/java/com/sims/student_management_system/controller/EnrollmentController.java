package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Enrollment;
import com.sims.student_management_system.service.EnrollmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService) {

        this.enrollmentService = enrollmentService;
    }

    // ============================================================
    // ENROLL
    // ============================================================

    @PostMapping
    public ResponseEntity<Enrollment> enrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {

        Enrollment enrollment =
                enrollmentService.enrollStudent(
                        studentId,
                        courseId);

        return new ResponseEntity<>(
                enrollment,
                HttpStatus.CREATED);
    }

    // ============================================================
    // GET ALL
    // ============================================================

    @GetMapping
    public ResponseEntity<List<Enrollment>>
    getAllEnrollments() {

        return ResponseEntity.ok(
                enrollmentService
                        .getAllEnrollments());
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment>
    getEnrollmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                enrollmentService
                        .getEnrollmentById(id));
    }

    // ============================================================
    // GET BY STUDENT
    // ============================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>>
    getEnrollmentsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                enrollmentService
                        .getEnrollmentsByStudent(
                                studentId));
    }

    // ============================================================
    // GET BY COURSE
    // ============================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>>
    getEnrollmentsByCourse(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                enrollmentService
                        .getEnrollmentsByCourse(
                                courseId));
    }

    // ============================================================
    // GET BY STATUS
    // ============================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Enrollment>>
    getEnrollmentsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                enrollmentService
                        .getEnrollmentsByStatus(
                                status));
    }

    // ============================================================
    // DROP COURSE
    // ============================================================

    @PutMapping("/{id}/drop")
    public ResponseEntity<String>
    dropCourse(
            @PathVariable Long id) {

        enrollmentService.dropCourse(id);

        return ResponseEntity.ok(
                "Course dropped successfully");
    }
}