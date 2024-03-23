package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.IHistoryBillRepository;
import com.example.webapp_shop_ecommerce.service.IHistoryBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoryBillServiceImpl extends BaseServiceImpl<HistoryBill, Long, IHistoryBillRepository> implements IHistoryBillService {

    @Autowired
    private IHistoryBillRepository historyBillRepository;

    @Override
    public List<HistoryBill> findHistoryBillsByBill(Long id) {
        return historyBillRepository.findByBillId(id);
    }
}
