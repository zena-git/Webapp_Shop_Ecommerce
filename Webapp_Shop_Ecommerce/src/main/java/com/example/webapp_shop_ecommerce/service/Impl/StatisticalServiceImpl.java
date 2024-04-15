package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.response.statistical.StatisticalReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.StatisticalTopSaleResponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.TopSaleReponse;
import com.example.webapp_shop_ecommerce.repositories.IStatisticalRepository;
import com.example.webapp_shop_ecommerce.service.IStatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticalServiceImpl implements IStatisticalService {
    @Autowired
    IStatisticalRepository statisticalRepo;
    @Override
    public ResponseEntity<?> findTopSale() {
        List<TopSaleReponse> lst = statisticalRepo.getAllTopSale();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllStatistical() {
        List<StatisticalReponse> lst = statisticalRepo.getAllStatistical();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
}
