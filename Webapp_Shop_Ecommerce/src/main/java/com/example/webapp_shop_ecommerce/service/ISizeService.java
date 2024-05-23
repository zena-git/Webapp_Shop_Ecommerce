package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Size;

import java.util.Optional;

public interface ISizeService extends IBaseService<Size,Long> {
    Optional<Size> findByName(String name);
}
