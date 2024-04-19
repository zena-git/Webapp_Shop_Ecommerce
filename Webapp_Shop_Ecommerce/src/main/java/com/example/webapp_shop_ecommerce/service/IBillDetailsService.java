package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.BillDetails;

import java.util.List;

public interface IBillDetailsService extends IBaseService<BillDetails,Long> {
    List<BillDetails> findAllByBill(Bill bill);
    List<BillDetails> findAllByBillAndStatus(Bill bill,String status);
}
