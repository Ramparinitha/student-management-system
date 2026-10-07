package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(
            @Valid @RequestBody Student student,
            @RequestParam Long departmentId) {

        Student createdStudent =
                studentService.createStudent(
                        student,
                        departmentId
                );

        return new ResponseEntity<>(
                createdStudent,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                studentService.getStudentById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestParam Long departmentId,
            @Valid @RequestBody Student student) {

        Student updatedStudent =
                studentService.updateStudent(
                        id,
                        student,
                        departmentId
                );

        return ResponseEntity.ok(
                updatedStudent
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return ResponseEntity.ok(
                "Student deleted successfully"
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(
            @RequestParam String name) {

        return ResponseEntity.ok(
                studentService.searchStudents(name)
        );
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Student>> getStudentsByDepartment(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                studentService.getStudentsByDepartment(
                        departmentId
                )
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Student>> getStudentsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                studentService.getStudentsByStatus(status)
        );
    }
}