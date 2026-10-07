        package com.sims.student_management_system.controller;

        import com.sims.student_management_system.dto.AcademicInformationResponse;
        import com.sims.student_management_system.dto.StudentDashboardResponse;
        import com.sims.student_management_system.dto.StudentProfileResponse;
        import com.sims.student_management_system.entity.Student;
        import com.sims.student_management_system.service.StudentProfileService;

        import jakarta.validation.Valid;

        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        @RestController
        @RequestMapping("/api/student-profile")
        public class StudentProfileController {

        private final StudentProfileService studentProfileService;

        public StudentProfileController(
                StudentProfileService studentProfileService) {

                this.studentProfileService = studentProfileService;
        }

        @GetMapping("/me")
        public ResponseEntity<StudentProfileResponse> getMyProfile() {

                return ResponseEntity.ok(
                        studentProfileService.getMyProfile()
                );
        }

        @GetMapping("/{studentId}")
        public ResponseEntity<StudentProfileResponse> getProfile(
                @PathVariable Long studentId) {

                return ResponseEntity.ok(
                        studentProfileService.getProfile(studentId)
                );
        }

        @PutMapping("/{studentId}")
        public ResponseEntity<StudentProfileResponse> updateProfile(
                @PathVariable Long studentId,
                @Valid @RequestBody Student student) {

                return ResponseEntity.ok(
                        studentProfileService.updateProfile(
                                studentId,
                                student
                        )
                );
        }

        @GetMapping("/{studentId}/academic")
        public ResponseEntity<AcademicInformationResponse>
        getAcademicInformation(
                @PathVariable Long studentId) {

                return ResponseEntity.ok(
                        studentProfileService
                                .getAcademicInformation(studentId)
                );
        }

        @PutMapping("/{studentId}/link-user/{userId}")
        public ResponseEntity<StudentProfileResponse>
        linkUserToStudent(
                @PathVariable Long studentId,
                @PathVariable Long userId) {

                return ResponseEntity.ok(
                        studentProfileService
                                .linkUserToStudent(
                                        studentId,
                                        userId
                                )
                );
        }

        @GetMapping("/{studentId}/dashboard")
        public ResponseEntity<StudentDashboardResponse>
        getDashboard(
                @PathVariable Long studentId) {

                return ResponseEntity.ok(
                        studentProfileService
                                .getDashboard(studentId)
                );
        }

        @GetMapping("/me/dashboard")
        public ResponseEntity<StudentDashboardResponse>
        getMyDashboard() {

                return ResponseEntity.ok(
                        studentProfileService.getMyDashboard()
                );
        }
        }