package com.example.webapp_shop_ecommerce.service;

import com.example.backend_web_truong_huong.entity.AttributesValues;

import java.util.Optional;

public interface IAttributesValueService {
    Optional<AttributesValues> findByName(String name);
}
