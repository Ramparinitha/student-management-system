package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Department;
import com.sims.student_management_system.repository.DepartmentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository) {

        this.departmentRepository =
                departmentRepository;
    }

    public Department createDepartment(
            Department department) {

        if (departmentRepository
                .existsByDepartmentCode(
                        department.getDepartmentCode())) {

            throw new RuntimeException(
                    "Department code already exists");
        }

        if (departmentRepository
                .existsByDepartmentName(
                        department.getDepartmentName())) {

            throw new RuntimeException(
                    "Department name already exists");
        }

        if (department.getStatus() == null ||
                department.getStatus().isBlank()) {

            department.setStatus("ACTIVE");
        }

        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {

        return departmentRepository.findAll();
    }

    public Department getDepartmentById(
            Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"));
    }

    public Department updateDepartment(
            Long id,
            Department updatedDepartment) {

        Department department =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found"));

        if (!department.getDepartmentCode()
                .equals(updatedDepartment
                        .getDepartmentCode())
                &&
                departmentRepository
                        .existsByDepartmentCode(
                                updatedDepartment
                                        .getDepartmentCode())) {

            throw new RuntimeException(
                    "Department code already exists");
        }

        if (!department.getDepartmentName()
                .equals(updatedDepartment
                        .getDepartmentName())
                &&
                departmentRepository
                        .existsByDepartmentName(
                                updatedDepartment
                                        .getDepartmentName())) {

            throw new RuntimeException(
                    "Department name already exists");
        }

        department.setDepartmentName(
                updatedDepartment.getDepartmentName());

        department.setDepartmentCode(
                updatedDepartment.getDepartmentCode());

        if (updatedDepartment.getStatus() != null &&
                !updatedDepartment.getStatus().isBlank()) {

            department.setStatus(
                    updatedDepartment.getStatus());
        }

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {

        if (!departmentRepository.existsById(id)) {

            throw new RuntimeException(
                    "Department not found");
        }

        departmentRepository.deleteById(id);
    }

    public List<Department> searchDepartments(
            String name) {

        return departmentRepository
                .findByDepartmentNameContainingIgnoreCase(
                        name);
    }
}