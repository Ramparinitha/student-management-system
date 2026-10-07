package com.sims.student_management_system.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI studentManagementOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Student Information Management System API")
                        .description(
                                "REST API documentation for the Student Information Management System. "
                                + "The system provides student, department, course, enrollment, "
                                + "attendance, examination and result management."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SIMS Development Team")
                        )
                )
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        "bearerAuth",
                                        new SecurityScheme()
                                                .name("Authorization")
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}