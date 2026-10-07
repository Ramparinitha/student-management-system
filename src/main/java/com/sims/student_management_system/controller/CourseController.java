package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Course;
import com.sims.student_management_system.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @Valid @RequestBody Course course,
            @RequestParam Long departmentId) {

        return new ResponseEntity<>(
                courseService.createCourse(course, departmentId),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestParam Long departmentId,
            @Valid @RequestBody Course course) {

        return ResponseEntity.ok(
                courseService.updateCourse(id, course, departmentId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {

        courseService.deleteCourse(id);

        return ResponseEntity.ok("Course deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(
            @RequestParam String name) {

        return ResponseEntity.ok(
                courseService.searchCourses(name)
        );
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Course>> getCoursesByDepartment(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                courseService.getCoursesByDepartment(departmentId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Course>> getCoursesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                courseService.getCoursesByStatus(status)
        );
    }
}