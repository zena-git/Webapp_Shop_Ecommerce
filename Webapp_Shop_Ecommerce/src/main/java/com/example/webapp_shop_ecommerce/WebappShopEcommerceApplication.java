package com.example.webapp_shop_ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebappShopEcommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebappShopEcommerceApplication.class, args);
    }

}
