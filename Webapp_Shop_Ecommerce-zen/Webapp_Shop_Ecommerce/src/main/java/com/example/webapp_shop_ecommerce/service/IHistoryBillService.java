package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;

public interface IHistoryBillService extends IBaseService<HistoryBill, Long> {
    Boolean addHistoryBill(Bill bill, String type, String description);
}
