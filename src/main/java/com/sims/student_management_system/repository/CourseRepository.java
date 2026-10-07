package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCourseCode(String courseCode);

    boolean existsByCourseCode(String courseCode);

    List<Course> findByCourseNameContainingIgnoreCase(String courseName);

    List<Course> findByDepartment_DepartmentId(Long departmentId);

    List<Course> findByStatusIgnoreCase(String status);
}