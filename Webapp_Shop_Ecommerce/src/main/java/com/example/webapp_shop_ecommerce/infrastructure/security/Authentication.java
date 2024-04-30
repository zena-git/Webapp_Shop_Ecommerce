package com.example.webapp_shop_ecommerce.infrastructure.security;

import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Authentication {
    @Autowired
    ICustomerService customerService;
    public Customer getCustomer() {
        return customerService.findById(Long.valueOf(5)).get();
    }
}
