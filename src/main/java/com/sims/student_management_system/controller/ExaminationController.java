package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Examination;
import com.sims.student_management_system.service.ExaminationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @PostMapping
    public ResponseEntity<Examination> createExamination(
            @RequestParam Long courseId,
            @Valid @RequestBody Examination examination) {

        return ResponseEntity.ok(
                examinationService.createExamination(
                        courseId,
                        examination));
    }

    @GetMapping
    public ResponseEntity<List<Examination>> getAllExaminations() {

        return ResponseEntity.ok(
                examinationService.getAllExaminations());
    }

    @GetMapping("/{examId}")
    public ResponseEntity<Examination> getExaminationById(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                examinationService.getExaminationById(examId));
    }

    @PutMapping("/{examId}")
    public ResponseEntity<Examination> updateExamination(
            @PathVariable Long examId,
            @RequestParam Long courseId,
            @Valid @RequestBody Examination examination) {

        return ResponseEntity.ok(
                examinationService.updateExamination(
                        examId,
                        courseId,
                        examination));
    }

    @DeleteMapping("/{examId}")
    public ResponseEntity<String> deleteExamination(
            @PathVariable Long examId) {

        examinationService.deleteExamination(examId);

        return ResponseEntity.ok(
                "Examination deleted successfully");
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Examination>> getByCourse(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                examinationService.getByCourse(courseId));
    }

    @GetMapping("/type/{examType}")
    public ResponseEntity<List<Examination>> getByType(
            @PathVariable String examType) {

        return ResponseEntity.ok(
                examinationService.getByType(examType));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Examination>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                examinationService.getByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Examination>> searchByName(
            @RequestParam String name) {

        return ResponseEntity.ok(
                examinationService.searchByName(name));
    }
}