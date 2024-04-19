package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Style;
import com.example.webapp_shop_ecommerce.repositories.IStyleRepository;
import com.example.webapp_shop_ecommerce.service.IStyleService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StyleServiceImpl extends BaseServiceImpl<Style, Long, IStyleRepository> implements IStyleService {

    @Override
    public Optional<Style> findByName(String name) {
        return repository.findByName(name);
    }
}
