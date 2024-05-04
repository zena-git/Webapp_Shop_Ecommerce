package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Color;
import com.example.webapp_shop_ecommerce.repositories.IColorRepository;
import com.example.webapp_shop_ecommerce.service.IColorService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ColorServiceImpl extends BaseServiceImpl<Color, Long, IColorRepository> implements IColorService {

    @Override
    public Optional<Color> findByName(String name) {
        return repository.findByName(name);
    }
}
