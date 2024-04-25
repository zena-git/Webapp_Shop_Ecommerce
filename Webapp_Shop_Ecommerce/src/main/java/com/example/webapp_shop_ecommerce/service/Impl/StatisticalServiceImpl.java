package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.response.statistical.StatisticalReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.StatisticalTopSaleResponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.Top5ProductSellingReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.TopSaleReponse;
import com.example.webapp_shop_ecommerce.repositories.IStatisticalRepository;
import com.example.webapp_shop_ecommerce.service.IStatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service

public class StatisticalServiceImpl implements IStatisticalService {
    @Autowired
    IStatisticalRepository statisticalRepo;
    @Override
    public ResponseEntity<?> findTopSale(LocalDateTime  startDate, LocalDateTime endDate) {
        List<TopSaleReponse> lst = statisticalRepo.getAllTopSale(startDate,endDate);
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllStatistical(LocalDateTime startDate, LocalDateTime endDate) {
        List<StatisticalReponse> lst = statisticalRepo.getAllStatistical(startDate,endDate);
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getTop5ProductSelling() {
        List<Top5ProductSellingReponse> lst = statisticalRepo.getTop5ProductSelling();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
}
