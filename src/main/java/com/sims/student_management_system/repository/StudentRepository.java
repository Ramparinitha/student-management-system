package com.sims.student_management_system.repository;

import com.sims.student_management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByEmailIgnoreCase(String email);

    Optional<Student> findByUser_EmailIgnoreCase(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<Student> findByNameContainingIgnoreCase(String name);

    List<Student> findByDepartment_DepartmentId(Long departmentId);

    List<Student> findByStatusIgnoreCase(String status);

    List<Student> findByNameContainingIgnoreCaseAndStatusIgnoreCase(
            String name,
            String status
    );
    boolean existsByPhone(String phone);
}
