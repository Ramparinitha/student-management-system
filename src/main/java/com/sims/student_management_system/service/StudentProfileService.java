package com.sims.student_management_system.service;

import com.sims.student_management_system.dto.AcademicInformationResponse;
import com.sims.student_management_system.dto.StudentDashboardResponse;
import com.sims.student_management_system.dto.StudentProfileResponse;
import com.sims.student_management_system.entity.Attendance;
import com.sims.student_management_system.entity.Enrollment;
import com.sims.student_management_system.entity.Examination;
import com.sims.student_management_system.entity.Result;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.entity.User;
import com.sims.student_management_system.repository.AttendanceRepository;
import com.sims.student_management_system.repository.EnrollmentRepository;
import com.sims.student_management_system.repository.ExaminationRepository;
import com.sims.student_management_system.repository.ResultRepository;
import com.sims.student_management_system.repository.StudentRepository;
import com.sims.student_management_system.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class StudentProfileService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExaminationRepository examinationRepository;
    private final ResultRepository resultRepository;

    public StudentProfileService(
            StudentRepository studentRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceRepository attendanceRepository,
            ExaminationRepository examinationRepository,
            ResultRepository resultRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.examinationRepository = examinationRepository;
        this.resultRepository = resultRepository;
    }

    public StudentProfileResponse getMyProfile() {

        Student student = getLoggedInStudent();

        return new StudentProfileResponse(student);
    }

    public StudentProfileResponse getProfile(Long studentId) {

        Student student = getStudent(studentId);

        checkStudentAccess(student);

        return new StudentProfileResponse(student);
    }

    public StudentProfileResponse updateProfile(
            Long studentId,
            Student updatedStudent) {

        Student student = getStudent(studentId);

        checkStudentAccess(student);

        if (updatedStudent.getName() == null ||
                updatedStudent.getName().isBlank()) {

            throw new RuntimeException(
                    "Student name cannot be empty");
        }

        if (updatedStudent.getPhone() == null ||
                updatedStudent.getPhone().isBlank()) {

            throw new RuntimeException(
                    "Student phone cannot be empty");
        }

        student.setName(
                updatedStudent.getName().trim());

        student.setPhone(
                updatedStudent.getPhone().trim());

        Student savedStudent =
                studentRepository.save(student);

        return new StudentProfileResponse(savedStudent);
    }

    public AcademicInformationResponse getAcademicInformation(
            Long studentId) {

        Student student = getStudent(studentId);

        checkStudentAccess(student);

        AcademicInformationResponse response =
                new AcademicInformationResponse();

        response.setProfile(
                new StudentProfileResponse(student));

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudent_StudentId(studentId);

        response.setEnrollments(enrollments);

        response.setAttendance(
                attendanceRepository
                        .findByStudent_StudentId(studentId));

        List<Examination> examinations =
                getActiveEnrollmentExaminations(enrollments);

        response.setExaminations(examinations);

        response.setResults(
                resultRepository
                        .findByStudent_StudentId(studentId));

        return response;
    }

    public StudentProfileResponse linkUserToStudent(
            Long studentId,
            Long userId) {

        if (!isAdmin()) {
            throw new RuntimeException(
                    "Only ADMIN users can link student accounts");
        }

        Student student = getStudent(studentId);

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        if (!"STUDENT".equalsIgnoreCase(
                user.getRole())) {

            throw new RuntimeException(
                    "Only STUDENT users can be linked");
        }

        if (student.getUser() != null) {
            throw new RuntimeException(
                    "Student is already linked to a user");
        }

        boolean userAlreadyLinked =
                studentRepository
                        .findByUser_EmailIgnoreCase(
                                user.getEmail())
                        .isPresent();

        if (userAlreadyLinked) {
            throw new RuntimeException(
                    "This user is already linked to a student");
        }

        student.setUser(user);

        Student savedStudent =
                studentRepository.save(student);

        return new StudentProfileResponse(savedStudent);
    }

    public StudentDashboardResponse getDashboard(
            Long studentId) {

        Student student = getStudent(studentId);

        checkStudentAccess(student);

        return buildDashboard(student);
    }

    public StudentDashboardResponse getMyDashboard() {

        Student student = getLoggedInStudent();

        return buildDashboard(student);
    }

    private StudentDashboardResponse buildDashboard(
            Student student) {

        Long studentId =
                student.getStudentId();

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudent_StudentId(studentId);

        List<Attendance> attendance =
                attendanceRepository
                        .findByStudent_StudentId(studentId);

        List<Result> results =
                resultRepository
                        .findByStudent_StudentId(studentId);

        /*
         * Only examinations from actively enrolled
         * courses are shown to the student.
         */
        List<Examination> examinations =
                getActiveEnrollmentExaminations(
                        enrollments);

        /*
         * Calculate attendance percentage.
         */
        double attendancePercentage = 0.0;

        if (!attendance.isEmpty()) {

            long presentCount =
                    attendance.stream()
                            .filter(att ->
                                    Boolean.TRUE.equals(
                                            att.getPresent()))
                            .count();

            attendancePercentage =
                    (presentCount * 100.0)
                            / attendance.size();

            attendancePercentage =
                    Math.round(
                            attendancePercentage * 100.0)
                            / 100.0;
        }

        StudentDashboardResponse response =
                new StudentDashboardResponse();

        response.setProfile(
                new StudentProfileResponse(student));

        response.setEnrollments(enrollments);

        response.setAttendance(attendance);

        response.setExaminations(examinations);

        response.setResults(results);

        response.setAttendancePercentage(
                attendancePercentage);

        response.setTotalCourses(
                getActiveEnrollmentCount(enrollments));

        response.setTotalAttendanceRecords(
                attendance.size());

        response.setTotalExaminations(
                examinations.size());

        response.setTotalResults(
                results.size());

        return response;
    }

    private List<Examination> getActiveEnrollmentExaminations(
            List<Enrollment> enrollments) {

        List<Examination> examinations =
                new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            if (!isActiveEnrollment(enrollment)) {
                continue;
            }

            if (enrollment.getCourse() == null) {
                continue;
            }

            Long courseId =
                    enrollment.getCourse().getCourseId();

            List<Examination> courseExaminations =
                    examinationRepository
                            .findByCourse_CourseId(courseId);

            for (Examination examination :
                    courseExaminations) {

                boolean alreadyAdded =
                        examinations.stream()
                                .anyMatch(existing ->
                                        existing.getExamId()
                                                .equals(
                                                        examination.getExamId()));

                if (!alreadyAdded) {
                    examinations.add(examination);
                }
            }
        }

        examinations.sort(
                Comparator.comparing(
                        Examination::getExamDate,
                        Comparator.nullsLast(
                                Comparator.naturalOrder())));

        return examinations;
    }

    private boolean isActiveEnrollment(
            Enrollment enrollment) {

        return enrollment != null &&
                enrollment.getStatus() != null &&
                "ENROLLED".equalsIgnoreCase(
                        enrollment.getStatus());
    }

    private long getActiveEnrollmentCount(
            List<Enrollment> enrollments) {

        return enrollments.stream()
                .filter(this::isActiveEnrollment)
                .count();
    }

    private Student getStudent(Long studentId) {

        return studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"));
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

        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Logged-in user not found"));

        if (!"STUDENT".equalsIgnoreCase(
                user.getRole())) {

            throw new RuntimeException(
                    "Only STUDENT users can access student data");
        }

        return studentRepository
                .findByUser_EmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No student profile is linked to this user"));
    }

    private void checkStudentAccess(
            Student student) {

        if (isAdmin()) {
            return;
        }

        Student loggedInStudent =
                getLoggedInStudent();

        if (!loggedInStudent.getStudentId()
                .equals(student.getStudentId())) {

            throw new RuntimeException(
                    "Access denied: You can only access your own student data");
        }
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