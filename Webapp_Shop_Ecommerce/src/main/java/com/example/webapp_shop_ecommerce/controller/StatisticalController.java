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

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/statistical")
public class StatisticalController {
    @Autowired
    IStatisticalService statisticalService;

    @GetMapping("/product/topsale")
    public ResponseEntity<?> findTopSale(
            @RequestParam(value = "enddate") String endDateStr,
            @RequestParam(value = "startdate") String startDateStr ) {

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        if (startDateStr != null && endDateStr != null) {
            System.out.println("Có dữ liệu");

            // Chuyển đổi chuỗi ngày tháng thành đối tượng Instant
            Instant startInstant = Instant.parse(startDateStr);
            Instant endInstant = Instant.parse(endDateStr);

            // Chuyển đổi Instant thành đối tượng LocalDateTime
            startDateTime = LocalDateTime.ofInstant(startInstant, ZoneOffset.UTC);
            endDateTime = LocalDateTime.ofInstant(endInstant, ZoneOffset.UTC);

            // Đặt giờ, phút và giây của startDate thành 00:00:00
            startDateTime = startDateTime.withHour(0).withMinute(0).withSecond(0);

            // Đặt giờ, phút và giây của endDate thành 23:59:59
            endDateTime = endDateTime.withHour(23).withMinute(59).withSecond(59);
        }
        return statisticalService.findTopSale(startDateTime, endDateTime);
    }



    @GetMapping("/revenue")
    public ResponseEntity<?> findStatistical(
            @RequestParam(value = "enddate") String endDateStr,
            @RequestParam(value = "startdate") String startDateStr ) {

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        if (startDateStr != null && endDateStr != null) {
            System.out.println("Có dữ liệu");

            // Chuyển đổi chuỗi ngày tháng thành đối tượng Instant
            Instant startInstant = Instant.parse(startDateStr);
            Instant endInstant = Instant.parse(endDateStr);

            // Chuyển đổi Instant thành đối tượng LocalDateTime
            startDateTime = LocalDateTime.ofInstant(startInstant, ZoneOffset.UTC);
            endDateTime = LocalDateTime.ofInstant(endInstant, ZoneOffset.UTC);

            // Đặt giờ, phút và giây của startDate thành 00:00:00
            startDateTime = startDateTime.withHour(0).withMinute(0).withSecond(0);

            // Đặt giờ, phút và giây của endDate thành 23:59:59
            endDateTime = endDateTime.withHour(23).withMinute(59).withSecond(59);
        }

        // Gọi phương thức từ service với các giá trị đã xác định
        return statisticalService.getAllStatistical(startDateTime, endDateTime);
    }

    @GetMapping("/top5selling")
    public ResponseEntity<?> findTop5Selling() {
        return statisticalService.getTop5ProductSelling();
    }
}
