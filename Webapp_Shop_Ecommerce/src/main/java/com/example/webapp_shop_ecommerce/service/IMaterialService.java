package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Material;

import java.util.Optional;

public interface IMaterialService extends IBaseService<Material,Long> {
    Optional<Material> findByName(String name);
    boolean existsByName(String name);
}
