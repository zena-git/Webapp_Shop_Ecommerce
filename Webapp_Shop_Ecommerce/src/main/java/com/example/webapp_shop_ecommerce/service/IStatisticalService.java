package com.example.webapp_shop_ecommerce.service;

import org.springframework.http.ResponseEntity;

public interface IStatisticalService {
    ResponseEntity<?> findTopSale();
    ResponseEntity<?> getAllStatistical();
}
