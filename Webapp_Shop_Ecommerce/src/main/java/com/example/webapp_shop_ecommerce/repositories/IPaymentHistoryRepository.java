package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.entity.PaymentHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface IPaymentHistoryRepository extends IBaseReporitory<PaymentHistory, Long>{
}
