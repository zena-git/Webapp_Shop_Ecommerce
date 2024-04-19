package com.example.webapp_shop_ecommerce.service;

import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface IStatisticalService {
    ResponseEntity<?> findTopSale(LocalDateTime  startDate, LocalDateTime endDate);
    ResponseEntity<?> getAllStatistical(LocalDateTime  startDate, LocalDateTime endDate);
}
