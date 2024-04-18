package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Color;

import java.util.Optional;

public interface IColorService extends IBaseService<Color,Long> {
    Optional<Color> findByName(String name);
}
