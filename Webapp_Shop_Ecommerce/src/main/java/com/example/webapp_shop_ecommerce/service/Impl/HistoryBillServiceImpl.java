package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.repositories.IHistoryBillRepository;
import com.example.webapp_shop_ecommerce.service.IHistoryBillService;
import org.springframework.stereotype.Service;

@Service
public class HistoryBillServiceImpl extends BaseServiceImpl<HistoryBill, Long, IHistoryBillRepository> implements IHistoryBillService {
}
