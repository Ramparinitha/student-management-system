package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Department;
import com.sims.student_management_system.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

        private final DepartmentService departmentService;

        public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @Valid @RequestBody Department department) {

        return new ResponseEntity<>(
                departmentService.createDepartment(department),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                departmentService.getDepartmentById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody Department department) {

        return ResponseEntity.ok(
                departmentService.updateDepartment(id, department)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable Long id) {

        departmentService.deleteDepartment(id);

        return ResponseEntity.ok(
                "Department deleted successfully"
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Department>> searchDepartments(
            @RequestParam String name) {

        return ResponseEntity.ok(
                departmentService.searchDepartments(name)
        );
    }
}