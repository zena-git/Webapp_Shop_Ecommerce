package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Style;

import java.util.Optional;

public interface IStyleService extends IBaseService<Style,Long> {
    Optional<Style> findByName(String name);
}
