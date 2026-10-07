package com.sims.student_management_system.controller;

import com.sims.student_management_system.dto.LoginRequest;
import com.sims.student_management_system.dto.LoginResponse;
import com.sims.student_management_system.dto.StudentRegistrationRequest;
import com.sims.student_management_system.dto.UserResponse;
import com.sims.student_management_system.entity.Student;
import com.sims.student_management_system.entity.User;
import com.sims.student_management_system.repository.StudentRepository;
import com.sims.student_management_system.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final StudentRepository studentRepository;

    public UserController(
            UserService userService,
            StudentRepository studentRepository
    ) {
        this.userService = userService;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/register/student")
    public ResponseEntity<UserResponse> registerStudent(
            @Valid @RequestBody StudentRegistrationRequest request) {

        User user = userService.registerStudent(request);

        Student student = studentRepository
                .findByEmailIgnoreCase(user.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Student record not found")
                );

        return new ResponseEntity<>(
                new UserResponse(
                        user,
                        student.getStudentId()
                ),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody User user) {

        User savedUser = userService.register(user);

        return new ResponseEntity<>(
                new UserResponse(savedUser),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userService.login(
                request.getIdentifier(),
                request.getPassword()
        );

        String token = userService.generateToken(user);

        return ResponseEntity.ok(
                new LoginResponse(
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        token
                )
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                new UserResponse(
                        userService.getUserById(userId)
                )
        );
    }

    @GetMapping("/email")
    public ResponseEntity<UserResponse> getUserByEmail(
            @RequestParam String email) {

        return ResponseEntity.ok(
                new UserResponse(
                        userService.getUserByEmail(email)
                )
        );
    }
}