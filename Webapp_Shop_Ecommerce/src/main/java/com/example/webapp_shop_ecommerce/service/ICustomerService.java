package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ICustomerService extends IBaseService<Customer, Long> {
    List<Customer> findByNameAndPhone(String keyWord);
    Optional<Customer> findCustomerByIdAndAddressNotDeleted (Long id);
}
