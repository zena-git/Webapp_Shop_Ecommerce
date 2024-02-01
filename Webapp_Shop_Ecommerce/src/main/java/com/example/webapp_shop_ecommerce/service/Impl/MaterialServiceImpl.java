package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Material;
import com.example.webapp_shop_ecommerce.repositories.IMaterialRepository;
import com.example.webapp_shop_ecommerce.service.IMaterialService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MaterialServiceImpl extends BaseServiceImpl<Material, Long, IMaterialRepository> implements IMaterialService {

    @Override
    public Optional<Material> findByName(String name) {
        return repository.findByName(name);
    }
}
