package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.AttributesValues;

import java.util.Optional;

public interface IAttributesValueService extends IBaseService<AttributesValues,Long> {
    Optional<AttributesValues> findByName(String name);
}
