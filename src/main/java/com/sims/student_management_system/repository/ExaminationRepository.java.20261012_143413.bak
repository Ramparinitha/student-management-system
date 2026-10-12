package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.time.LocalDate;

public interface ExaminationRepository
        extends JpaRepository<Examination, Long> {

    List<Examination> findByCourse_CourseId(
            Long courseId
    );

    List<Examination> findByExamTypeIgnoreCase(
            String examType
    );

    List<Examination> findByStatusIgnoreCase(
            String status
    );

    List<Examination> findByExamNameContainingIgnoreCase(
            String examName
    );

    boolean existsByExamDate(LocalDate examDate);

    boolean existsByExamDateAndExamIdNot(LocalDate examDate, Long examId);
}