package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Product;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAddressRepository extends IBaseReporitory<Address,Long> {
    List<Address> findAddressByCustomerAndDeletedFalse(Customer customer);
    List<Address> findAddressByCustomerAndDefaultAddressTrue(Customer customer);
}
