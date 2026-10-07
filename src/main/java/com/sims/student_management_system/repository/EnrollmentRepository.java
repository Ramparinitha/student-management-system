package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudent_StudentId(
            Long studentId
    );

    List<Enrollment> findByCourse_CourseId(
            Long courseId
    );

    List<Enrollment> findByStatusIgnoreCase(
            String status
    );

    List<Enrollment> findByStudent_StudentIdAndCourse_CourseId(
            Long studentId,
            Long courseId
    );

    List<Enrollment> findByStudent_StudentIdAndStatusIgnoreCase(
            Long studentId,
            String status
    );

    boolean existsByStudent_StudentIdAndCourse_CourseIdAndStatusIgnoreCase(
            Long studentId,
            Long courseId,
            String status
    );
}