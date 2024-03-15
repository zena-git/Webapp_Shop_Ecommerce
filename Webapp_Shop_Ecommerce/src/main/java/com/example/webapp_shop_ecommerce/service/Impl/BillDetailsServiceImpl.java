package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.repositories.IBillDetailsRepository;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import com.example.webapp_shop_ecommerce.service.IBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillDetailsServiceImpl extends BaseServiceImpl<BillDetails, Long, IBillDetailsRepository> implements IBillDetailsService {
    @Override
    public List<BillDetails> findAllByBill(Bill bill) {
        return repository.findAllByBill(bill);
    }
}
