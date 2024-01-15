package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Attributes;

import java.util.Optional;

public interface IAttributesService extends IBaseService<Attributes, Long>{
    Optional<Attributes> findByName(String name);
}
