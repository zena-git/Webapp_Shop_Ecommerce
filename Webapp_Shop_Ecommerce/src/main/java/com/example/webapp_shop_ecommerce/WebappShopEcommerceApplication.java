package com.example.webapp_shop_ecommerce;

import lombok.SneakyThrows;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebappShopEcommerceApplication {

    public static void main(String[] args) {
//        Thread t = new Thread() {
//            public void run() {
//                String str = "xin chao cac ban";
//                while (true) {
//                    try {
//
//                        Thread.sleep(1000);
//                        System.out.println(str);
//                        str = reverse(str);
//                    } catch (Exception e) {
//                        System.out.println();
//                    }
//                }
//            }
//        };
//        t.start();
        SpringApplication.run(WebappShopEcommerceApplication.class, args);
    }


//    private static String reverse(String str) {
//        return str.substring(1, str.length() ) + String.valueOf(str.charAt(0));
//    }
}
