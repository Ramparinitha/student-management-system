package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Course;
import com.sims.student_management_system.entity.Department;
import com.sims.student_management_system.repository.CourseRepository;
import com.sims.student_management_system.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    public CourseService(CourseRepository courseRepository,
                         DepartmentRepository departmentRepository) {
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
    }

    public Course createCourse(Course course, Long departmentId) {

        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new RuntimeException("Course code already exists");
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        course.setDepartment(department);

        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course updateCourse(Long id, Course updatedCourse, Long departmentId) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getCourseCode().equals(updatedCourse.getCourseCode())
                && courseRepository.existsByCourseCode(updatedCourse.getCourseCode())) {
            throw new RuntimeException("Course code already exists");
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        course.setCourseName(updatedCourse.getCourseName());
        course.setCourseCode(updatedCourse.getCourseCode());
        course.setCredits(updatedCourse.getCredits());
        course.setStatus(updatedCourse.getStatus());
        course.setDepartment(department);

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {

        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found");
        }

        courseRepository.deleteById(id);
    }

    public List<Course> searchCourses(String name) {
        return courseRepository.findByCourseNameContainingIgnoreCase(name);
    }

    public List<Course> getCoursesByDepartment(Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Department not found");
        }

        return courseRepository.findByDepartment_DepartmentId(departmentId);
    }

    public List<Course> getCoursesByStatus(String status) {
        return courseRepository.findByStatusIgnoreCase(status);
    }
}