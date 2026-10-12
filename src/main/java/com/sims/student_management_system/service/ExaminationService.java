package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Course;
import com.sims.student_management_system.entity.Examination;
import com.sims.student_management_system.repository.CourseRepository;
import com.sims.student_management_system.repository.ExaminationRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.List;

@Service
public class ExaminationService {

    private final ExaminationRepository examinationRepository;
    private final CourseRepository courseRepository;

    public ExaminationService(
            ExaminationRepository examinationRepository,
            CourseRepository courseRepository) {

        this.examinationRepository = examinationRepository;
        this.courseRepository = courseRepository;
    }

    public Examination createExamination(
            Long courseId,
            Examination examination) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        if (!"ACTIVE".equalsIgnoreCase(course.getStatus())) {
            throw new RuntimeException(
                    "Cannot create examination for an inactive course");
        }

        validateExamDate(examination.getExamDate(), null);

        examination.setCourse(course);

        if (examination.getStatus() == null ||
                examination.getStatus().isBlank()) {

            examination.setStatus("SCHEDULED");

        } else {

            examination.setStatus(
                    examination.getStatus().trim().toUpperCase());
        }

        return examinationRepository.save(examination);
    }

    public List<Examination> getAllExaminations() {

        return examinationRepository.findAll();
    }

    public Examination getExaminationById(Long id) {

        return examinationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Examination not found"));
    }

    
public Examination updateExamination(
        Long id,
        Long courseId,
        Examination updatedExamination) {

    Examination existing =
            examinationRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Examination not found"));

    Course course =
            courseRepository.findById(courseId)
                    .orElseThrow(() ->
                            new RuntimeException("Course not found"));

    if (!"ACTIVE".equalsIgnoreCase(course.getStatus())) {
        throw new RuntimeException(
                "Cannot assign examination to an inactive course");
    }

    String requestedStatus = updatedExamination.getStatus();

    if (requestedStatus == null || requestedStatus.isBlank()) {
        requestedStatus = existing.getStatus();
    } else {
        requestedStatus = requestedStatus.trim().toUpperCase();
    }

    LocalDate requestedDate = updatedExamination.getExamDate();

    boolean dateChanged =
            requestedDate != null &&
            !requestedDate.equals(existing.getExamDate());

    boolean completingPastExam =
            "COMPLETED".equals(requestedStatus)
            && existing.getExamDate() != null
            && existing.getExamDate().isBefore(LocalDate.now())
            && !dateChanged;

    if (dateChanged && !completingPastExam) {
        validateExamDate(requestedDate, id);
    }

    existing.setCourse(course);

    if (updatedExamination.getExamName() != null
            && !updatedExamination.getExamName().isBlank()) {
        existing.setExamName(updatedExamination.getExamName());
    }

    if (updatedExamination.getExamType() != null
            && !updatedExamination.getExamType().isBlank()) {
        existing.setExamType(updatedExamination.getExamType());
    }

    if (requestedDate != null) {
        existing.setExamDate(requestedDate);
    }

    existing.setStatus(requestedStatus);

    return examinationRepository.save(existing);
}


    private void validateExamDate(LocalDate examDate, Long excludedExamId) {

        if (examDate == null) {
            throw new RuntimeException("Exam date is required");
        }

        if (examDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Examinations cannot be scheduled on Sunday");
        }

        LocalDate minimumAllowedDate = LocalDate.now().plusDays(1);

        if (examDate.isBefore(minimumAllowedDate)) {
            throw new RuntimeException(
                    "Examination must be scheduled at least 24 hours in advance");
        }

        boolean dateAlreadyUsed = excludedExamId == null
                ? examinationRepository.existsByExamDate(examDate)
                : examinationRepository.existsByExamDateAndExamIdNot(
                        examDate, excludedExamId);

        if (dateAlreadyUsed) {
            throw new RuntimeException(
                    "Another examination is already scheduled on this date");
        }
    }

    public void deleteExamination(Long id) {

        if (!examinationRepository.existsById(id)) {
            throw new RuntimeException(
                    "Examination not found");
        }

        examinationRepository.deleteById(id);
    }

    public List<Examination> getByCourse(
            Long courseId) {

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException(
                    "Course not found");
        }

        return examinationRepository
                .findByCourse_CourseId(courseId);
    }

    public List<Examination> getByType(
            String examType) {

        if (examType == null || examType.isBlank()) {
            throw new RuntimeException(
                    "Exam type is required");
        }

        return examinationRepository
                .findByExamTypeIgnoreCase(examType);
    }

    public List<Examination> getByStatus(
            String status) {

        if (status == null || status.isBlank()) {
            throw new RuntimeException(
                    "Examination status is required");
        }

        return examinationRepository
                .findByStatusIgnoreCase(status);
    }

    public List<Examination> searchByName(
            String examName) {

        if (examName == null || examName.isBlank()) {
            throw new RuntimeException(
                    "Exam name is required");
        }

        return examinationRepository
                .findByExamNameContainingIgnoreCase(
                        examName);
    }
}