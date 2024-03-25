package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.PaymentHistory;
import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.repositories.IPaymentHistoryRepository;
import com.example.webapp_shop_ecommerce.repositories.IUsersRepository;
import com.example.webapp_shop_ecommerce.service.IPaymentHistoryService;
import com.example.webapp_shop_ecommerce.service.IUsersService;
import org.springframework.stereotype.Service;

@Service
public class PaymentHistoryServiceImpl extends BaseServiceImpl<PaymentHistory, Long, IPaymentHistoryRepository> implements IPaymentHistoryService {
}
