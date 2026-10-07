package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Course;
import com.sims.student_management_system.entity.Enrollment;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.repository.CourseRepository;
import com.sims.student_management_system.repository.EnrollmentRepository;
import com.sims.student_management_system.repository.StudentRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment enrollStudent(
            Long studentId,
            Long courseId) {

        checkStudentAccess(studentId);

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"));

        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"));

        if (!"ACTIVE".equalsIgnoreCase(
                student.getStatus())) {

            throw new RuntimeException(
                    "Inactive students cannot enroll in courses");
        }

        if (!"ACTIVE".equalsIgnoreCase(
                course.getStatus())) {

            throw new RuntimeException(
                    "Cannot enroll in an inactive course");
        }

        List<Enrollment> existingEnrollments =
                enrollmentRepository
                        .findByStudent_StudentIdAndCourse_CourseId(
                                studentId,
                                courseId);

        if (!existingEnrollments.isEmpty()) {

            Enrollment existing =
                    existingEnrollments.get(0);

            if ("ENROLLED".equalsIgnoreCase(
                    existing.getStatus())) {

                throw new RuntimeException(
                        "Student is already enrolled in this course");
            }

            existing.setStatus("ENROLLED");

            return enrollmentRepository.save(existing);
        }

        Enrollment enrollment =
                new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus("ENROLLED");

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {

        if (isAdmin()) {
            return enrollmentRepository.findAll();
        }

        Student student =
                getLoggedInStudent();

        return enrollmentRepository
                .findByStudent_StudentId(
                        student.getStudentId());
    }

    public Enrollment getEnrollmentById(
            Long id) {

        Enrollment enrollment =
                enrollmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Enrollment not found"));

        if (enrollment.getStudent() == null) {
            throw new RuntimeException(
                    "Enrollment student information not found");
        }

        checkStudentAccess(
                enrollment.getStudent()
                        .getStudentId());

        return enrollment;
    }

    public List<Enrollment> getEnrollmentsByStudent(
            Long studentId) {

        checkStudentAccess(studentId);

        return enrollmentRepository
                .findByStudent_StudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourse(
            Long courseId) {

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException(
                    "Course not found");
        }

        if (isAdmin()) {

            return enrollmentRepository
                    .findByCourse_CourseId(courseId);
        }

        Student student =
                getLoggedInStudent();

        return enrollmentRepository
                .findByStudent_StudentIdAndCourse_CourseId(
                        student.getStudentId(),
                        courseId);
    }

    public List<Enrollment> getEnrollmentsByStatus(
            String status) {

        if (status == null ||
                status.isBlank()) {

            throw new RuntimeException(
                    "Enrollment status is required");
        }

        if (isAdmin()) {

            return enrollmentRepository
                    .findByStatusIgnoreCase(status);
        }

        Student student =
                getLoggedInStudent();

        return enrollmentRepository
                .findByStudent_StudentIdAndStatusIgnoreCase(
                        student.getStudentId(),
                        status);
    }

    public void dropCourse(Long id) {

        Enrollment enrollment =
                enrollmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Enrollment not found"));

        if (enrollment.getStudent() == null) {
            throw new RuntimeException(
                    "Enrollment student information not found");
        }

        checkStudentAccess(
                enrollment.getStudent()
                        .getStudentId());

        if ("DROPPED".equalsIgnoreCase(
                enrollment.getStatus())) {

            throw new RuntimeException(
                    "Course is already dropped");
        }

        enrollment.setStatus("DROPPED");

        enrollmentRepository.save(enrollment);
    }

    private void checkStudentAccess(
            Long studentId) {

        if (isAdmin()) {
            return;
        }

        Student loggedInStudent =
                getLoggedInStudent();

        if (!loggedInStudent.getStudentId()
                .equals(studentId)) {

            throw new RuntimeException(
                    "You are not allowed to access another student's enrollments");
        }
    }

    private Student getLoggedInStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                authentication.getName() == null ||
                authentication.getName().isBlank()) {

            throw new RuntimeException(
                    "User is not authenticated");
        }

        String email =
                authentication.getName();

        return studentRepository
                .findByUser_EmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student account is not linked to a student profile"));
    }

    private boolean isAdmin() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication != null &&
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_ADMIN".equals(
                                        authority.getAuthority()));
    }
}