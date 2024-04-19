package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Size;
import com.example.webapp_shop_ecommerce.repositories.ISizeRepository;
import com.example.webapp_shop_ecommerce.service.ISizeService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SizeServiceImpl extends BaseServiceImpl<Size, Long, ISizeRepository> implements ISizeService {

    @Override
    public Optional<Size> findByName(String name) {
        return repository.findByName(name);
    }
}
