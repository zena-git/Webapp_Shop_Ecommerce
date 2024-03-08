package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.IAddressRepository;
import com.example.webapp_shop_ecommerce.service.IAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl extends BaseServiceImpl<Address, Long, IAddressRepository> implements IAddressService {
    @Autowired
    private Authentication authentication;
    @Override
    public List<Address> findAddressByCustomerAndDeletedFalse() {
        return repository.findAddressByCustomerAndDeletedFalse(authentication.getCustomer());
    }
}
