package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Brand;
import com.example.webapp_shop_ecommerce.repositories.IBrandRepository;
import com.example.webapp_shop_ecommerce.service.IBrandService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service

public class BrandServiceImpl extends BaseServiceImpl<Brand, Long, IBrandRepository> implements IBrandService {

    @Override
    public Optional<Brand> findByName(String name) {
        return repository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        return repository.existsBrandByName(name);
    }
}
