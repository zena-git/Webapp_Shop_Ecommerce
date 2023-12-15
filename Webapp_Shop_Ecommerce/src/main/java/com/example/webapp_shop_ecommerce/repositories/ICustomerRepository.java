package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.stereotype.Repository;

@Repository
public interface ICustomerRepository extends IBaseReporitory<Customer, Long> {
}
