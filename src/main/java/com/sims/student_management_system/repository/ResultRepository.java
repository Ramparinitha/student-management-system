package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudent_StudentId(Long studentId);

    List<Result> findByExamination_ExamId(Long examId);

    List<Result> findByGradeIgnoreCase(String grade);

    List<Result> findByResultStatusIgnoreCase(String resultStatus);

    boolean existsByExamination_ExamIdAndStudent_StudentId(
            Long examId,
            Long studentId);

    boolean existsByExamination_ExamIdAndStudent_StudentIdAndResultIdNot(
            Long examId,
            Long studentId,
            Long resultId);
}