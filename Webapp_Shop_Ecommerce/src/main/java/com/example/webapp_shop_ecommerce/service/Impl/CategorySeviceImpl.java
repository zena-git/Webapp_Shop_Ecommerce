package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.repositories.ICategoryRepository;
import com.example.webapp_shop_ecommerce.service.ICategoryService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategorySeviceImpl extends BaseServiceImpl<Category, Long, ICategoryRepository> implements ICategoryService {
    @Override
    public Optional<Category> findByName(String name) {
        return repository.findByName(name);
    }
}
