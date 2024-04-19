package com.example.webapp_shop_ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {
    @Value("")
    private String host;

    @Value("")
    private Integer port;

    @Value("")
    private String email;

    @Value("")
    private String password;

    @Value("true")
    private String isSSL;

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(465);

        mailSender.setUsername("lilypeachew@gmail.com");
        mailSender.setPassword("qvkqqmokvtbgyhmh");
        mailSender.setDefaultEncoding("UTF-8");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.enable", true);
        props.put("mail.smtp.from", "lilypeachew@gmail.com");
        props.put("mail.debug", "true");
        props.put("mail.smtp.socketFactory.fallback", "true");
        return mailSender;
    }
}
