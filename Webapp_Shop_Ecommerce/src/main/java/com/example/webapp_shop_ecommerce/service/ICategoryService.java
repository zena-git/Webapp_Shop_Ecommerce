package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Category;

import java.util.Optional;

public interface ICategoryService {
    Optional<Category> findByName(String name);
}
