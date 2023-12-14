package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Attributes;
import com.example.webapp_shop_ecommerce.repositories.IAttributesRepository;
import com.example.webapp_shop_ecommerce.service.IAttributesService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AttributesServiceImpl extends BaseServiceImpl<Attributes, Long, IAttributesRepository> implements IAttributesService {

    @Override
    public Optional<Attributes> findByName(String name) {
        return repository.findByName(name);
    }
}
