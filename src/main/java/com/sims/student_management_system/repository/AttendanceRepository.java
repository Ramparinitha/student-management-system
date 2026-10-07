package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudent_StudentId(
            Long studentId
    );

    List<Attendance> findByCourse_CourseId(
            Long courseId
    );

    List<Attendance>
    findByStudent_StudentIdAndCourse_CourseId(
            Long studentId,
            Long courseId
    );

    boolean
    existsByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(
            Long studentId,
            Long courseId,
            LocalDate attendanceDate
    );

    boolean
    existsByStudent_StudentIdAndCourse_CourseIdAndAttendanceDateAndAttendanceIdNot(
            Long studentId,
            Long courseId,
            LocalDate attendanceDate,
            Long attendanceId
    );
}