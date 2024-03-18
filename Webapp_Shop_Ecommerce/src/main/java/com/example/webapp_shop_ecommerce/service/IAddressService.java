package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Customer;

import java.util.List;

public interface IAddressService extends IBaseService<Address, Long>{
    List<Address> findAddressByCustomerAndDeletedFalse();

}
