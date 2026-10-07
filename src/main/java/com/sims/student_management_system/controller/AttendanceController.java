package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Attendance;
import com.sims.student_management_system.service.AttendanceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    // ============================================================
    // MARK ATTENDANCE
    // ============================================================

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @Valid @RequestBody Attendance attendance) {

        return new ResponseEntity<>(
                attendanceService.markAttendance(
                        studentId,
                        courseId,
                        attendance
                ),
                HttpStatus.CREATED
        );
    }

    // ============================================================
    // GET ALL ATTENDANCE
    // ============================================================

    @GetMapping
    public ResponseEntity<List<Attendance>>
    getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }

    // ============================================================
    // GET ATTENDANCE BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<Attendance>
    getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceById(id)
        );
    }

    // ============================================================
    // GET ATTENDANCE BY STUDENT
    // ============================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>>
    getAttendanceByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByStudent(studentId)
        );
    }

    // ============================================================
    // GET ATTENDANCE BY COURSE
    // ============================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Attendance>>
    getAttendanceByCourse(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByCourse(courseId)
        );
    }

    // ============================================================
    // GET STUDENT + COURSE ATTENDANCE
    // ============================================================

    @GetMapping(
            "/student/{studentId}/course/{courseId}"
    )
    public ResponseEntity<List<Attendance>>
    getAttendanceByStudentAndCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByStudentAndCourse(
                                studentId,
                                courseId
                        )
        );
    }

    // ============================================================
    // GET ATTENDANCE PERCENTAGE
    // ============================================================

    @GetMapping("/percentage")
    public ResponseEntity<Map<String, Object>>
    getAttendancePercentage(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {

        double percentage =
                attendanceService.getAttendancePercentage(
                        studentId,
                        courseId
                );

        return ResponseEntity.ok(
                Map.of(
                        "studentId", studentId,
                        "courseId", courseId,
                        "attendancePercentage", percentage
                )
        );
    }

    // ============================================================
    // UPDATE ATTENDANCE
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<Attendance>
    updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody Attendance attendance) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(
                        id,
                        attendance
                )
        );
    }

    // ============================================================
    // DELETE ATTENDANCE
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.ok(
                "Attendance deleted successfully"
        );
    }
}