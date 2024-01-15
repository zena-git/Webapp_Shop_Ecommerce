package com.example.webapp_shop_ecommerce.service;


import com.example.webapp_shop_ecommerce.entity.Product;

import java.util.List;
import java.util.Optional;

public interface IProductService extends IBaseService<Product, Long> {
    Optional<Product> findByName(String name);
    Optional<Product> findByProductDetailByIdProduct(Long idProduct);
    List<Product> findProductByName(String name);
//    Optional<Product> findByCodeProduct(String code);
}
