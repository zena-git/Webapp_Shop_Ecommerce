package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import com.example.webapp_shop_ecommerce.service.IProductService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductServiceImpl extends BaseServiceImpl<Product, Long, IProductRepository> implements IProductService {

    @Override
    public Optional<Product> findByName(String name) {
        return repository.findByName(name);
    }

    @Override
    public Optional<Product> findByProductDetailByIdProduct(Long idProduct) {

        return repository.findProductDetailsById(idProduct);
    }

//    @Override
//    public Optional<Product> findByCodeProduct(String code) {
//           return repository.findByCodeProduct(code);
//
//    }
}
