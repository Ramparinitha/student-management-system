package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.*;
import com.sims.student_management_system.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExaminationRepository examinationRepository;
    private final ResultRepository resultRepository;

    public AdminController(
            StudentRepository studentRepository,
            DepartmentRepository departmentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceRepository attendanceRepository,
            ExaminationRepository examinationRepository,
            ResultRepository resultRepository) {

        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.examinationRepository = examinationRepository;
        this.resultRepository = resultRepository;
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentRepository.findAll());
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    @GetMapping("/examinations")
    public ResponseEntity<List<Examination>> getAllExaminations() {
        return ResponseEntity.ok(examinationRepository.findAll());
    }

    @GetMapping("/results")
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(resultRepository.findAll());
    }
}