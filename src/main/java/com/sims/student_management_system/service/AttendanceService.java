
package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Attendance;
import com.sims.student_management_system.entity.Course;
import com.sims.student_management_system.entity.Enrollment;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.repository.AttendanceRepository;
import com.sims.student_management_system.repository.CourseRepository;
import com.sims.student_management_system.repository.EnrollmentRepository;
import com.sims.student_management_system.repository.StudentRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // ============================================================
    // MARK ATTENDANCE
    // ============================================================

    public Attendance markAttendance(
            Long studentId,
            Long courseId,
            Attendance attendance) {

        checkFaculty();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        if (!"ACTIVE".equalsIgnoreCase(student.getStatus())) {
            throw new RuntimeException(
                    "Cannot mark attendance for inactive student");
        }

        if (!"ACTIVE".equalsIgnoreCase(course.getStatus())) {
            throw new RuntimeException(
                    "Cannot mark attendance for inactive course");
        }

        checkActiveEnrollment(studentId, courseId);

        if (attendance.getAttendanceDate() == null) {
            throw new RuntimeException(
                    "Attendance date is required");
        }

        if (attendance.getPresent() == null) {
            throw new RuntimeException(
                    "Present status is required");
        }

        boolean alreadyExists =
                attendanceRepository
                        .existsByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(
                                studentId,
                                courseId,
                                attendance.getAttendanceDate());

        if (alreadyExists) {
            throw new RuntimeException(
                    "Attendance already recorded for this date");
        }

        attendance.setStudent(student);
        attendance.setCourse(course);

        return attendanceRepository.save(attendance);
    }

    // ============================================================
    // GET ALL ATTENDANCE
    // ============================================================

    public List<Attendance> getAllAttendance() {

        if (isAdmin() || isFaculty()) {
            return attendanceRepository.findAll();
        }

        Student student = getLoggedInStudent();

        return attendanceRepository.findByStudent_StudentId(
                student.getStudentId());
    }

    // ============================================================
    // GET ATTENDANCE BY ID
    // ============================================================

    public Attendance getAttendanceById(Long id) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance record not found"));

        checkAttendanceAccess(attendance);

        return attendance;
    }

    // ============================================================
    // GET ATTENDANCE BY STUDENT
    // ============================================================

    public List<Attendance> getAttendanceByStudent(
            Long studentId) {

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found"));

        checkStudentAccess(student);

        return attendanceRepository.findByStudent_StudentId(
                studentId);
    }

    // ============================================================
    // GET ATTENDANCE BY COURSE
    // ============================================================

    public List<Attendance> getAttendanceByCourse(
            Long courseId) {

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found");
        }

        if (isAdmin() || isFaculty()) {
            return attendanceRepository.findByCourse_CourseId(
                    courseId);
        }

        Student student = getLoggedInStudent();

        return attendanceRepository
                .findByStudent_StudentIdAndCourse_CourseId(
                        student.getStudentId(),
                        courseId);
    }

    // ============================================================
    // GET ATTENDANCE BY STUDENT + COURSE
    // ============================================================

    public List<Attendance> getAttendanceByStudentAndCourse(
            Long studentId,
            Long courseId) {

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found"));

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found");
        }

        checkStudentAccess(student);

        return attendanceRepository
                .findByStudent_StudentIdAndCourse_CourseId(
                        studentId,
                        courseId);
    }

    // ============================================================
    // UPDATE ATTENDANCE
    // ============================================================

    public Attendance updateAttendance(
            Long id,
            Attendance updatedAttendance) {

        checkFaculty();

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance record not found"));

        if (updatedAttendance.getAttendanceDate() == null) {
            throw new RuntimeException(
                    "Attendance date is required");
        }

        if (updatedAttendance.getPresent() == null) {
            throw new RuntimeException(
                    "Present status is required");
        }

        Long studentId =
                attendance.getStudent().getStudentId();

        Long courseId =
                attendance.getCourse().getCourseId();

        checkActiveEnrollment(studentId, courseId);

        boolean duplicate =
                attendanceRepository
                        .existsByStudent_StudentIdAndCourse_CourseIdAndAttendanceDateAndAttendanceIdNot(
                                studentId,
                                courseId,
                                updatedAttendance.getAttendanceDate(),
                                id);

        if (duplicate) {
            throw new RuntimeException(
                    "Attendance already exists for this student, course and date");
        }

        attendance.setAttendanceDate(
                updatedAttendance.getAttendanceDate());

        attendance.setPresent(
                updatedAttendance.getPresent());

        return attendanceRepository.save(attendance);
    }

    // ============================================================
    // DELETE ATTENDANCE
    // ============================================================

    public void deleteAttendance(Long id) {

        checkFaculty();

        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException(
                    "Attendance record not found");
        }

        attendanceRepository.deleteById(id);
    }

    // ============================================================
    // ATTENDANCE PERCENTAGE
    // ============================================================

    public double getAttendancePercentage(
            Long studentId,
            Long courseId) {

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found"));

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found");
        }

        checkStudentAccess(student);

        List<Attendance> records =
                attendanceRepository
                        .findByStudent_StudentIdAndCourse_CourseId(
                                studentId,
                                courseId);

        if (records.isEmpty()) {
            return 0.0;
        }

        long presentCount =
                records.stream()
                        .filter(record ->
                                Boolean.TRUE.equals(record.getPresent()))
                        .count();

        double percentage =
                (presentCount * 100.0) / records.size();

        return Math.round(percentage * 100.0) / 100.0;
    }

    // ============================================================
    // CHECK ACTIVE ENROLLMENT
    // ============================================================

    private void checkActiveEnrollment(
            Long studentId,
            Long courseId) {

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudent_StudentIdAndCourse_CourseId(
                                studentId,
                                courseId);

        boolean activelyEnrolled =
                enrollments.stream()
                        .anyMatch(enrollment ->
                                "ENROLLED".equalsIgnoreCase(
                                        enrollment.getStatus()));

        if (!activelyEnrolled) {
            throw new RuntimeException(
                    "Student is not actively enrolled in this course");
        }
    }

    // ============================================================
    // FACULTY ACCESS CHECK
    // ============================================================

    private void checkFaculty() {

        if (!isFaculty()) {
            throw new RuntimeException(
                    "Only FACULTY users can perform this operation");
        }
    }

    // ============================================================
    // STUDENT ACCESS CHECK
    // ============================================================

    private void checkStudentAccess(Student student) {

        if (isAdmin() || isFaculty()) {
            return;
        }

        Student loggedInStudent = getLoggedInStudent();

        if (!loggedInStudent.getStudentId()
                .equals(student.getStudentId())) {

            throw new RuntimeException(
                    "Access denied: You can only access your own attendance");
        }
    }

    // ============================================================
    // ATTENDANCE ACCESS CHECK
    // ============================================================

    private void checkAttendanceAccess(Attendance attendance) {

        if (isAdmin() || isFaculty()) {
            return;
        }

        if (attendance.getStudent() == null) {
            throw new RuntimeException(
                    "Attendance student information not found");
        }

        Student loggedInStudent = getLoggedInStudent();

        if (!loggedInStudent.getStudentId()
                .equals(attendance.getStudent().getStudentId())) {

            throw new RuntimeException(
                    "Access denied: You can only access your own attendance");
        }
    }

    // ============================================================
    // GET LOGGED-IN STUDENT
    // ============================================================

    private Student getLoggedInStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || authentication.getName() == null
                || authentication.getName().isBlank()) {

            throw new RuntimeException("Authentication required");
        }

        String email = authentication.getName();

        return studentRepository
                .findByUser_EmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student profile is not linked to this account"));
    }

    // ============================================================
    // ADMIN ROLE CHECK
    // ============================================================

    private boolean isAdmin() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication != null
                && authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_ADMIN".equals(
                                        authority.getAuthority()));
    }

    // ============================================================
    // FACULTY ROLE CHECK
    // ============================================================

    private boolean isFaculty() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication != null
                && authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_FACULTY".equals(
                                        authority.getAuthority()));
    }
}
