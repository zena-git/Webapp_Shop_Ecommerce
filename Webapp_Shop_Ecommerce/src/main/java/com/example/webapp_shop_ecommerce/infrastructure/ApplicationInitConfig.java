package com.example.webapp_shop_ecommerce.infrastructure;

import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.infrastructure.enums.Roles;
import com.example.webapp_shop_ecommerce.repositories.IUsersRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(IUsersRepository userRepository) {
        log.info("Init application.....");
        return args -> {
            if (userRepository.findByEmail("admin@admin.com").isEmpty()) {

                Users user = Users.builder()
                        .fullName("Lại Văn Chiến")
                        .email("admin@admin.com")
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .usersRole(Roles.ADMIN)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
        };
    }
}
