package com.example.webapp_shop_ecommerce.service;


import com.example.webapp_shop_ecommerce.entity.Product;

import java.util.Optional;

public interface IProductService {
    Optional<Product> findByName(String name);
    Optional<Product> findByProductDetailByIdProduct(Long idProduct);

//    Optional<Product> findByCodeProduct(String code);
}
