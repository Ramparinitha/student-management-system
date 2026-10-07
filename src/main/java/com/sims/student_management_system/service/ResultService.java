package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Enrollment;
import com.sims.student_management_system.entity.Examination;
import com.sims.student_management_system.entity.Result;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.repository.EnrollmentRepository;
import com.sims.student_management_system.repository.ExaminationRepository;
import com.sims.student_management_system.repository.ResultRepository;
import com.sims.student_management_system.repository.StudentRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final ExaminationRepository examinationRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ResultService(
            ResultRepository resultRepository,
            StudentRepository studentRepository,
            ExaminationRepository examinationRepository,
            EnrollmentRepository enrollmentRepository) {

        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.examinationRepository = examinationRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    /*
     * =========================================================
     * ADD RESULT
     * =========================================================
     */

    public Result addResult(
            Long studentId,
            Long examId,
            Result result) {

        checkAdmin();

        if (studentId == null) {
            throw new RuntimeException(
                    "Student ID is required");
        }

        if (examId == null) {
            throw new RuntimeException(
                    "Examination ID is required");
        }

        validateMarks(result);

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"));

        Examination examination =
                examinationRepository.findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Examination not found"));

        validateStudent(student);

        validateExamination(examination);

        Long courseId =
                examination.getCourse()
                        .getCourseId();

        validateActiveEnrollment(
                studentId,
                courseId);

        if (resultRepository
                .existsByExamination_ExamIdAndStudent_StudentId(
                        examId,
                        studentId)) {

            throw new RuntimeException(
                    "Result already exists for this student and examination");
        }

        /*
         * Never trust student-supplied student/examination
         * objects from the request body.
         *
         * Always use the records loaded from the database.
         */
        result.setStudent(student);
        result.setExamination(examination);

        calculateGrade(result);

        return resultRepository.save(result);
    }

    /*
     * =========================================================
     * GET ALL RESULTS
     * =========================================================
     */

    public List<Result> getAllResults() {

        if (isAdmin()) {

            return resultRepository.findAll();
        }

        Student student =
                getLoggedInStudent();

        return resultRepository
                .findByStudent_StudentId(
                        student.getStudentId());
    }

    /*
     * =========================================================
     * GET RESULT BY ID
     * =========================================================
     */

    public Result getResultById(
            Long resultId) {

        Result result =
                resultRepository.findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found"));

        checkResultAccess(result);

        return result;
    }

    /*
     * =========================================================
     * UPDATE RESULT
     * =========================================================
     */

    public Result updateResult(
            Long resultId,
            Result updatedResult) {

        checkAdmin();

        Result existingResult =
                resultRepository.findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found"));

        validateMarks(updatedResult);

        if (existingResult.getStudent() == null) {

            throw new RuntimeException(
                    "Existing result has no student information");
        }

        if (existingResult.getExamination() == null) {

            throw new RuntimeException(
                    "Existing result has no examination information");
        }

        Student student =
                existingResult.getStudent();

        Examination examination =
                existingResult.getExamination();

        validateStudent(student);

        validateExamination(examination);

        Long studentId =
                student.getStudentId();

        Long examId =
                examination.getExamId();

        Long courseId =
                examination.getCourse()
                        .getCourseId();

        validateActiveEnrollment(
                studentId,
                courseId);

        if (resultRepository
                .existsByExamination_ExamIdAndStudent_StudentIdAndResultIdNot(
                        examId,
                        studentId,
                        resultId)) {

            throw new RuntimeException(
                    "Another result already exists for this student and examination");
        }

        existingResult.setMarks(
                updatedResult.getMarks());

        /*
         * Always recalculate these values.
         */
        calculateGrade(existingResult);

        return resultRepository.save(existingResult);
    }

    /*
     * =========================================================
     * DELETE RESULT
     * =========================================================
     */

    public void deleteResult(
            Long resultId) {

        checkAdmin();

        Result result =
                resultRepository.findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found"));

        resultRepository.delete(result);
    }

    /*
     * =========================================================
     * GET RESULTS BY STUDENT
     * =========================================================
     */

    public List<Result> getByStudent(
            Long studentId) {

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"));

        checkStudentAccess(student);

        return resultRepository
                .findByStudent_StudentId(studentId);
    }

    /*
     * =========================================================
     * GET RESULTS BY EXAMINATION
     * =========================================================
     */

    public List<Result> getByExamination(
            Long examId) {

        Examination examination =
                examinationRepository.findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Examination not found"));

        validateExamination(examination);

        if (isAdmin()) {

            return resultRepository
                    .findByExamination_ExamId(examId);
        }

        Student student =
                getLoggedInStudent();

        Long courseId =
                examination.getCourse()
                        .getCourseId();

        validateActiveEnrollment(
                student.getStudentId(),
                courseId);

        return resultRepository
                .findByExamination_ExamId(examId)
                .stream()
                .filter(result ->
                        result.getStudent() != null &&
                        result.getStudent()
                                .getStudentId()
                                .equals(
                                        student.getStudentId()))
                .collect(Collectors.toList());
    }

    /*
     * =========================================================
     * GET RESULTS BY GRADE
     * =========================================================
     */

    public List<Result> getByGrade(
            String grade) {

        if (grade == null ||
                grade.isBlank()) {

            throw new RuntimeException(
                    "Grade is required");
        }

        String normalizedGrade =
                grade.trim();

        if (isAdmin()) {

            return resultRepository
                    .findByGradeIgnoreCase(
                            normalizedGrade);
        }

        Student student =
                getLoggedInStudent();

        return resultRepository
                .findByStudent_StudentId(
                        student.getStudentId())
                .stream()
                .filter(result ->
                        result.getGrade() != null &&
                        result.getGrade()
                                .equalsIgnoreCase(
                                        normalizedGrade))
                .collect(Collectors.toList());
    }

    /*
     * =========================================================
     * GET RESULTS BY STATUS
     * =========================================================
     */

    public List<Result> getByStatus(
            String status) {

        if (status == null ||
                status.isBlank()) {

            throw new RuntimeException(
                    "Result status is required");
        }

        String normalizedStatus =
                status.trim();

        if (isAdmin()) {

            return resultRepository
                    .findByResultStatusIgnoreCase(
                            normalizedStatus);
        }

        Student student =
                getLoggedInStudent();

        return resultRepository
                .findByStudent_StudentId(
                        student.getStudentId())
                .stream()
                .filter(result ->
                        result.getResultStatus() != null &&
                        result.getResultStatus()
                                .equalsIgnoreCase(
                                        normalizedStatus))
                .collect(Collectors.toList());
    }

    /*
     * =========================================================
     * VALIDATE STUDENT
     * =========================================================
     */

    private void validateStudent(
            Student student) {

        if (student == null) {

            throw new RuntimeException(
                    "Student information is required");
        }

        if (student.getStatus() == null ||
                !"ACTIVE".equalsIgnoreCase(
                        student.getStatus())) {

            throw new RuntimeException(
                    "Cannot add or update result for inactive student");
        }
    }

    /*
     * =========================================================
     * VALIDATE EXAMINATION
     * =========================================================
     */

    private void validateExamination(
            Examination examination) {

        if (examination == null) {

            throw new RuntimeException(
                    "Examination information is required");
        }

        if (examination.getExamId() == null) {

            throw new RuntimeException(
                    "Invalid examination ID");
        }

        if (examination.getCourse() == null ||
                examination.getCourse().getCourseId() == null) {

            throw new RuntimeException(
                    "Examination course information not found");
        }
    }

    /*
     * =========================================================
     * VALIDATE MARKS
     * =========================================================
     */

    private void validateMarks(
            Result result) {

        if (result == null) {

            throw new RuntimeException(
                    "Result data is required");
        }

        if (result.getMarks() == null) {

            throw new RuntimeException(
                    "Marks are required");
        }

        if (result.getMarks() < 0 ||
                result.getMarks() > 50) {

            throw new RuntimeException(
                    "Marks must be between 0 and 50");
        }
    }

    /*
     * =========================================================
     * CALCULATE GRADE
     * =========================================================
     *
     * Maximum marks = 50
     *
     * 90-100% -> A+
     * 80-89%  -> A
     * 70-79%  -> B
     * 60-69%  -> C
     * 50-59%  -> D
     * Below 50 -> F
     */

    private void calculateGrade(
            Result result) {

        double marks =
                result.getMarks();

        double percentage =
                (marks / 50.0) * 100.0;

        if (percentage >= 90) {

            result.setGrade("A+");
            result.setResultStatus("PASS");

        } else if (percentage >= 80) {

            result.setGrade("A");
            result.setResultStatus("PASS");

        } else if (percentage >= 70) {

            result.setGrade("B");
            result.setResultStatus("PASS");

        } else if (percentage >= 60) {

            result.setGrade("C");
            result.setResultStatus("PASS");

        } else if (percentage >= 50) {

            result.setGrade("D");
            result.setResultStatus("PASS");

        } else {

            result.setGrade("F");
            result.setResultStatus("FAIL");
        }
    }

    /*
     * =========================================================
     * CHECK ACTIVE ENROLLMENT
     * =========================================================
     */

    private void validateActiveEnrollment(
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
                                enrollment.getStatus() != null &&
                                "ENROLLED".equalsIgnoreCase(
                                        enrollment.getStatus()));

        if (!activelyEnrolled) {

            throw new RuntimeException(
                    "Student is not actively enrolled in this course");
        }
    }

    /*
     * =========================================================
     * CHECK RESULT ACCESS
     * =========================================================
     */

    private void checkResultAccess(
            Result result) {

        if (isAdmin()) {
            return;
        }

        if (result.getStudent() == null) {

            throw new RuntimeException(
                    "Result student information not found");
        }

        Student student =
                getLoggedInStudent();

        if (!student.getStudentId()
                .equals(
                        result.getStudent()
                                .getStudentId())) {

            throw new RuntimeException(
                    "Access denied: You can only access your own results");
        }
    }

    /*
     * =========================================================
     * CHECK STUDENT ACCESS
     * =========================================================
     */

    private void checkStudentAccess(
            Student student) {

        if (isAdmin()) {
            return;
        }

        Student loggedInStudent =
                getLoggedInStudent();

        if (!loggedInStudent.getStudentId()
                .equals(
                        student.getStudentId())) {

            throw new RuntimeException(
                    "Access denied: You can only access your own results");
        }
    }

    /*
     * =========================================================
     * GET LOGGED-IN STUDENT
     * =========================================================
     */

    private Student getLoggedInStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                authentication.getName() == null ||
                authentication.getName().isBlank()) {

            throw new RuntimeException(
                    "Authentication required");
        }

        String email =
                authentication.getName();

        return studentRepository
                .findByUser_EmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student profile is not linked to this account"));
    }

    /*
     * =========================================================
     * ADMIN CHECK
     * =========================================================
     */

    private void checkAdmin() {

        if (!isAdmin()) {

            throw new RuntimeException(
                    "Only ADMIN users can perform this operation");
        }
    }

    /*
     * =========================================================
     * ROLE CHECK
     * =========================================================
     */

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