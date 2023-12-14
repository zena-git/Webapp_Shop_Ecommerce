package com.example.webapp_shop_ecommerce.service;

import com.example.backend_web_truong_huong.entity.Attributes;

import java.util.Optional;

public interface IAttributesService {
    Optional<Attributes> findByName(String name);
}
