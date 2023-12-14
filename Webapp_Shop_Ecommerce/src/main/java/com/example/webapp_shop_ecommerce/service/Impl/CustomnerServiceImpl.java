package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.repositories.ICustomerRepository;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import org.springframework.stereotype.Service;

@Service
public class CustomnerServiceImpl extends BaseServiceImpl<Customer, Long, ICustomerRepository> implements ICustomerService {
}
