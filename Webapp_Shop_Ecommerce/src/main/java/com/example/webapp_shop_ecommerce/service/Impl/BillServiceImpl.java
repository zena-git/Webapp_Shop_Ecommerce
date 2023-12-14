package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.repositories.IBillRepository;
import com.example.webapp_shop_ecommerce.service.IBillService;
import org.springframework.stereotype.Service;

@Service
public class BillServiceImpl extends BaseServiceImpl<Bill, Long, IBillRepository> implements IBillService {
}
