package com.sims.student_management_system.service;

import com.sims.student_management_system.entity.Department;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.repository.DepartmentRepository;
import com.sims.student_management_system.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public StudentService(
            StudentRepository studentRepository,
            DepartmentRepository departmentRepository) {

        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    public Student createStudent(Student student, Long departmentId) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        student.setDepartment(department);

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(
            Long id,
            Student updatedStudent,
            Long departmentId) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getEmail().equals(updatedStudent.getEmail())
                && studentRepository.existsByEmail(updatedStudent.getEmail())) {

            throw new RuntimeException("Email already registered");
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        student.setName(updatedStudent.getName());
        student.setEmail(updatedStudent.getEmail());
        student.setPhone(updatedStudent.getPhone());
        student.setStatus(updatedStudent.getStatus());
        student.setDepartment(department);

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }

        studentRepository.deleteById(id);
    }

    public List<Student> searchStudents(String name) {

        return studentRepository
                .findByNameContainingIgnoreCase(name);
    }

    public List<Student> getStudentsByDepartment(Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Department not found");
        }

        return studentRepository
                .findByDepartment_DepartmentId(departmentId);
    }

    public List<Student> getStudentsByStatus(String status) {

        return studentRepository
                .findByStatusIgnoreCase(status);
    }
}