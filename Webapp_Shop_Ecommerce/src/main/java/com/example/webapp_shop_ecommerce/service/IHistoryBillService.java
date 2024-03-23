package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;

import java.util.List;

public interface IHistoryBillService extends IBaseService<HistoryBill, Long> {
    List<HistoryBill> findHistoryBillsByBill(Long id);
}
