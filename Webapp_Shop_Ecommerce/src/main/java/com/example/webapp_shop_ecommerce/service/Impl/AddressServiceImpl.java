package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.repositories.IAddressRepository;
import com.example.webapp_shop_ecommerce.service.IAddressService;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl extends BaseServiceImpl<Address, Long, IAddressRepository> implements IAddressService {

}
