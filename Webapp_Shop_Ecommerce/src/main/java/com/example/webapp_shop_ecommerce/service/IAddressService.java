package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IAddressService extends IBaseService<Address, Long>{
    List<Address> findAddressByCustomerAndDeletedFalse();

    ResponseEntity<ResponseObject> save(AddressRequest request);
    ResponseEntity<ResponseObject> update(AddressRequest request, Long id);

}
