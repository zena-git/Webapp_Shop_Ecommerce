package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.AttributesValues;
import com.example.webapp_shop_ecommerce.repositories.IAttributesValuesRepository;
import com.example.webapp_shop_ecommerce.service.IAttributesValueService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AttributesValuesServiceImpl extends BaseServiceImpl<AttributesValues, Long, IAttributesValuesRepository> implements IAttributesValueService {

    @Override
    public Optional<AttributesValues> findByName(String name) {
        return repository.findAllByName(name);
    }
}
