package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Result;
import com.sims.student_management_system.service.ResultService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(
            ResultService resultService) {

        this.resultService = resultService;
    }

    /*
     * =========================================================
     * ADD RESULT
     * =========================================================
     */

    @PostMapping
    public ResponseEntity<Result> addResult(
            @RequestParam Long studentId,
            @RequestParam Long examId,
            @Valid @RequestBody Result result) {

        return ResponseEntity.ok(
                resultService.addResult(
                        studentId,
                        examId,
                        result));
    }

    /*
     * =========================================================
     * GET ALL RESULTS
     * =========================================================
     */

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {

        return ResponseEntity.ok(
                resultService.getAllResults());
    }

    /*
     * =========================================================
     * GET RESULT BY ID
     * =========================================================
     */

    @GetMapping("/{resultId}")
    public ResponseEntity<Result> getResultById(
            @PathVariable Long resultId) {

        return ResponseEntity.ok(
                resultService.getResultById(
                        resultId));
    }

    /*
     * =========================================================
     * UPDATE RESULT
     * =========================================================
     */

    @PutMapping("/{resultId}")
    public ResponseEntity<Result> updateResult(
            @PathVariable Long resultId,
            @Valid @RequestBody Result result) {

        return ResponseEntity.ok(
                resultService.updateResult(
                        resultId,
                        result));
    }

    /*
     * =========================================================
     * DELETE RESULT
     * =========================================================
     */

    @DeleteMapping("/{resultId}")
    public ResponseEntity<String> deleteResult(
            @PathVariable Long resultId) {

        resultService.deleteResult(
                resultId);

        return ResponseEntity.ok(
                "Result deleted successfully");
    }

    /*
     * =========================================================
     * GET RESULTS BY STUDENT
     * =========================================================
     */

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                resultService.getByStudent(
                        studentId));
    }

    /*
     * =========================================================
     * GET RESULTS BY EXAMINATION
     * =========================================================
     */

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<Result>> getByExamination(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                resultService.getByExamination(
                        examId));
    }

    /*
     * =========================================================
     * GET RESULTS BY GRADE
     * =========================================================
     */

    @GetMapping("/grade/{grade}")
    public ResponseEntity<List<Result>> getByGrade(
            @PathVariable String grade) {

        return ResponseEntity.ok(
                resultService.getByGrade(
                        grade));
    }

    /*
     * =========================================================
     * GET RESULTS BY STATUS
     * =========================================================
     */

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Result>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                resultService.getByStatus(
                        status));
    }
}