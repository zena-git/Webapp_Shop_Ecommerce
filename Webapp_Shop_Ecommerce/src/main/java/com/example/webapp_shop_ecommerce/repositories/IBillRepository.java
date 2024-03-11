package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBillRepository extends IBaseReporitory<Bill, Long> {
    List<Bill> findBillByCustomer(Customer customer);
}
