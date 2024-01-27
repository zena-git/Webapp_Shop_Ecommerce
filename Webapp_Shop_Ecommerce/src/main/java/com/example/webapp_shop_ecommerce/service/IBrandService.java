package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Brand;

import java.util.Optional;

public interface IBrandService extends IBaseService<Brand, Long>{
    Optional<Brand> findByName(String name);
}
