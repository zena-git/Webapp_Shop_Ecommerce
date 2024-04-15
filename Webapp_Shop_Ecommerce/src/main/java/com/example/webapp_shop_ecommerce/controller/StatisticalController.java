package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.service.IStatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/statistical")
public class StatisticalController {
    @Autowired
    IStatisticalService statisticalService;

    @GetMapping("/product/topsale")
    public ResponseEntity<?> findTopSale(
            @RequestParam(value = "endDate", defaultValue = "-1") String endDate,
            @RequestParam(value = "startDate", defaultValue = "-1") String startDate ) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (!Objects.equals(startDate, "-1") && !Objects.equals(endDate, "-1")) {
            System.out.println("có data");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            startDateTime = LocalDateTime.parse(startDate.trim() + " 00:00:00", formatter);
            endDateTime = LocalDateTime.parse(endDate.trim() + " 23:59:59", formatter);
        }

        return statisticalService.findTopSale();
    }


    @GetMapping
    public ResponseEntity<?> findStatistical(
            @RequestParam(value = "endDate", defaultValue = "-1") String endDate,
            @RequestParam(value = "startDate", defaultValue = "-1") String startDate ) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (!Objects.equals(startDate, "-1") && !Objects.equals(endDate, "-1")) {
            System.out.println("có data");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            startDateTime = LocalDateTime.parse(startDate.trim() + " 00:00:00", formatter);
            endDateTime = LocalDateTime.parse(endDate.trim() + " 23:59:59", formatter);
        }

        return statisticalService.getAllStatistical();
    }
}
