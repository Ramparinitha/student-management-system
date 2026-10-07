package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentCode(String departmentCode);

    Optional<Department> findByDepartmentName(String departmentName);

    boolean existsByDepartmentCode(String departmentCode);

    boolean existsByDepartmentName(String departmentName);

    List<Department> findByDepartmentNameContainingIgnoreCase(String departmentName);
}
