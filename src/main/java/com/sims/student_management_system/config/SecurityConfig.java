package com.sims.student_management_system.config;

import com.sims.student_management_system.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
        List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174"
        )
);

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==============================
                        // PUBLIC AUTHENTICATION
                        // ==============================

                        .requestMatchers(
                                "/api/users/register/student",
                                "/api/users/login"
                        ).permitAll()

                        // ==============================
                        // ADMIN USER MANAGEMENT
                        // ==============================

                        .requestMatchers(
                                "/api/users/register"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/*"
                        ).hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // SWAGGER
                        // ==============================

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // ==============================
                        // ADMIN APIs
                        // ==============================

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // STUDENT PROFILE
                        // ==============================

                        .requestMatchers(
                                "/api/student-profile/**"
                        ).hasAnyAuthority(
                                "ROLE_ADMIN",
                                "ROLE_STUDENT"
                        )

                        // ==============================
                        // ENROLLMENT
                        // ==============================

                        // ENROLLMENT - VIEW
.requestMatchers(
        HttpMethod.GET,
        "/api/enrollments",
        "/api/enrollments/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_FACULTY",
        "ROLE_STUDENT"
)

// ENROLLMENT - CREATE
.requestMatchers(
        HttpMethod.POST,
        "/api/enrollments",
        "/api/enrollments/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_FACULTY",
        "ROLE_STUDENT"
)

// ENROLLMENT - UPDATE / DROP
.requestMatchers(
        HttpMethod.PUT,
        "/api/enrollments",
        "/api/enrollments/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_STUDENT"
)

// ENROLLMENT - DELETE
.requestMatchers(
        HttpMethod.DELETE,
        "/api/enrollments/**"
).hasAuthority("ROLE_ADMIN")

                        
                        // ==============================
                        // ATTENDANCE - VIEW
                        // ==============================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attendance",
                                "/api/attendance/**"
                        ).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_STUDENT",
        "ROLE_FACULTY"
)


                        // ==============================
                        // ATTENDANCE - ADMIN
                        // ==============================

                        .requestMatchers(
        HttpMethod.POST,
        "/api/attendance",
        "/api/attendance/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_FACULTY"
)

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/attendance/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/attendance/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // EXAMINATION - VIEW
                        // ==============================

                        .requestMatchers(HttpMethod.GET, "/api/examinations", "/api/examinations/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_STUDENT", "ROLE_FACULTY")

                        // ==============================
                        // EXAMINATION - ADMIN
                        // ==============================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/examinations/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/examinations/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/examinations/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // RESULTS - VIEW
                        // ==============================

                        
.requestMatchers(
        HttpMethod.GET,
        "/api/results",
        "/api/results/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_STUDENT",
        "ROLE_FACULTY"
)


                        // ==============================
                        // RESULTS - ADMIN
                        // ==============================

                        .requestMatchers(HttpMethod.POST, "/api/results", "/api/results/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_FACULTY")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/results/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/results/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // COURSES - VIEW
                        // ==============================

                        
.requestMatchers(
        HttpMethod.GET,
        "/api/courses",
        "/api/courses/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_STUDENT",
        "ROLE_FACULTY"
)


                        // ==============================
                        // COURSES - ADMIN
                        // ==============================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/courses/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/courses/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/courses/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // STUDENT MANAGEMENT - ADMIN
                        // ==============================
// Faculty and admin can view student records.
// Only admin can create, update, or delete students.


.requestMatchers(
        HttpMethod.GET,
        "/api/students",
        "/api/students/**"
).hasAnyAuthority(
        "ROLE_ADMIN",
        "ROLE_FACULTY"
)

.requestMatchers(
        "/api/students",
        "/api/students/**"
).hasAuthority("ROLE_ADMIN")
                       // ==============================
                        // DEPARTMENT MANAGEMENT - ADMIN
                        // ==============================

                        .requestMatchers(HttpMethod.GET, "/api/departments/**")
    .permitAll()

.requestMatchers("/api/departments/**")
    .hasAuthority("ROLE_ADMIN")

                        // ==============================
                        // EVERYTHING ELSE
                        // ==============================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}

