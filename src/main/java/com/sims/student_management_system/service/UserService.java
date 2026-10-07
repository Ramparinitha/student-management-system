package com.sims.student_management_system.service;

import com.sims.student_management_system.dto.StudentRegistrationRequest;
import com.sims.student_management_system.entity.Department;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.entity.User;
import com.sims.student_management_system.repository.DepartmentRepository;
import com.sims.student_management_system.repository.StudentRepository;
import com.sims.student_management_system.repository.UserRepository;
import com.sims.student_management_system.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public User registerStudent(StudentRegistrationRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already registered");
        }

        if (studentRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Student email already registered");
        }

        Department department = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException("Department not found")
                );

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole("STUDENT");

        User savedUser = userRepository.save(user);

        Student student = new Student();

        student.setName(request.getName().trim());
        student.setEmail(email);
        student.setPhone(request.getPhone().trim());
        student.setStatus("ACTIVE");
        student.setDepartment(department);
        student.setUser(savedUser);

        studentRepository.save(student);

        return savedUser;
    }

    public User register(User user) {

        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already registered");
        }

        user.setEmail(email);

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User login(String identifier, String password) {

        String value = identifier.trim();

        User user;

        if (value.matches("\\d+")) {

            Long studentId;

            try {
                studentId = Long.parseLong(value);
            } catch (NumberFormatException exception) {
                throw new RuntimeException(
                        "Invalid student ID or password"
                );
            }

            Student student = studentRepository
                    .findById(studentId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Invalid student ID or password"
                            )
                    );

            if (student.getUser() == null) {
                throw new RuntimeException(
                        "Student account is not linked correctly"
                );
            }

            user = student.getUser();

            if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
                throw new RuntimeException(
                        "Invalid student ID or password"
                );
            }

        } else {

            user = userRepository
                    .findByEmailIgnoreCase(value)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Invalid email or password"
                            )
                    );
        }

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid login credentials"
            );
        }

        return user;
    }

    public String generateToken(User user) {

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }

    public User getUserById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    public User getUserByEmail(String email) {

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }
}