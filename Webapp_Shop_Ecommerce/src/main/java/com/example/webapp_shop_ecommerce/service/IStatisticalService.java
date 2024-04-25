package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.response.statistical.Top5ProductSellingReponse;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IStatisticalService {
    ResponseEntity<?> findTopSale(LocalDateTime  startDate, LocalDateTime endDate);
    ResponseEntity<?> getAllStatistical(LocalDateTime  startDate, LocalDateTime endDate);

    ResponseEntity<?>  getTop5ProductSelling();
}
