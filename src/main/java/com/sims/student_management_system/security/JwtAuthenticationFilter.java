
package com.sims.student_management_system.security;

import com.sims.student_management_system.entity.User;
import com.sims.student_management_system.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.err.println("### JWT FILTER RUNNING: "
                + request.getMethod() + " "
                + request.getRequestURI());

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            System.err.println("### JWT: Bearer token missing");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7).trim();

        if (token.isEmpty()) {
            System.err.println("### JWT: Token is empty");

            filterChain.doFilter(request, response);
            return;
        }

        System.err.println("### JWT: Bearer token received");

        try {
            if (!jwtService.isTokenValid(token)) {
                System.err.println(
                        "### JWT: Token invalid or expired");

                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            System.err.println("### JWT: Token is valid");

            String email = jwtService.extractEmail(token);

            if (email == null || email.isBlank()) {
                System.err.println(
                        "### JWT: Email missing from token");

                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            User user = userRepository
                    .findByEmailIgnoreCase(email)
                    .orElse(null);

            if (user == null) {
                System.err.println("### JWT: User not found");

                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            if (user.getRole() == null
                    || user.getRole().isBlank()) {

                System.err.println("### JWT: User role missing");

                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            String role = user.getRole()
                    .trim()
                    .toUpperCase();

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority("ROLE_" + role);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(authority)
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            System.err.println("### JWT AUTHENTICATED: "
                    + email + " | " + authority.getAuthority());

        } catch (Exception e) {
            System.err.println("### JWT ERROR: "
                    + e.getClass().getSimpleName()
                    + " - " + e.getMessage());

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
