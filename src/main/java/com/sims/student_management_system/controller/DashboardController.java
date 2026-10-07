package com.sims.student_management_system.controller;

import com.sims.student_management_system.entity.Department;
import com.sims.student_management_system.repository.DepartmentRepository;
import com.sims.student_management_system.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public DashboardController(
            StudentRepository studentRepository,
            DepartmentRepository departmentRepository) {

        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard() {

        long totalStudents = studentRepository.count();
        long totalDepartments = departmentRepository.count();

        long activeStudents =
                studentRepository.findByStatusIgnoreCase("ACTIVE").size();

        long inactiveStudents =
                studentRepository.findByStatusIgnoreCase("INACTIVE").size();

        List<Map<String, Object>> departmentStatistics = new ArrayList<>();

        List<Department> departments =
                departmentRepository.findAll();

        for (Department department : departments) {

            long studentCount =
                    studentRepository
                            .findByDepartment_DepartmentId(
                                    department.getDepartmentId())
                            .size();

            Map<String, Object> departmentData = new LinkedHashMap<>();

            departmentData.put(
                    "departmentId",
                    department.getDepartmentId()
            );

            departmentData.put(
                    "departmentName",
                    department.getDepartmentName()
            );

            departmentData.put(
                    "departmentCode",
                    department.getDepartmentCode()
            );

            departmentData.put(
                    "studentCount",
                    studentCount
            );

            departmentStatistics.add(departmentData);
        }

        Map<String, Object> dashboard = new LinkedHashMap<>();

        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalDepartments", totalDepartments);
        dashboard.put("activeStudents", activeStudents);
        dashboard.put("inactiveStudents", inactiveStudents);
        dashboard.put("departments", departmentStatistics);

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Map<String, Object>> getDepartmentStatistics(
            @PathVariable Long departmentId) {

        Department department =
                departmentRepository.findById(departmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Department not found"));

        long studentCount =
                studentRepository
                        .findByDepartment_DepartmentId(departmentId)
                        .size();

        long activeStudents =
                studentRepository
                        .findByDepartment_DepartmentId(departmentId)
                        .stream()
                        .filter(student ->
                                student.getStatus()
                                        .equalsIgnoreCase("ACTIVE"))
                        .count();

        long inactiveStudents =
                studentRepository
                        .findByDepartment_DepartmentId(departmentId)
                        .stream()
                        .filter(student ->
                                student.getStatus()
                                        .equalsIgnoreCase("INACTIVE"))
                        .count();

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("departmentId", department.getDepartmentId());
        result.put("departmentName", department.getDepartmentName());
        result.put("departmentCode", department.getDepartmentCode());
        result.put("studentCount", studentCount);
        result.put("activeStudents", activeStudents);
        result.put("inactiveStudents", inactiveStudents);

        return ResponseEntity.ok(result);
    }
}