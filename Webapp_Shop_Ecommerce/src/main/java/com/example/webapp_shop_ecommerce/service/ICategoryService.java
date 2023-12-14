package com.example.webapp_shop_ecommerce.service;

import com.example.backend_web_truong_huong.entity.Category;

import java.util.Optional;

public interface ICategoryService {
    Optional<Category> findByName(String name);
}
