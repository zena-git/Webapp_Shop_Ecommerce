package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductDetailsService extends BaseServiceImpl<ProductDetails, Long, IProductDetailsRepository> implements IProductDetailsService {
    @Override
    public Page<ProductDetails> findAllByProduct(Long productId,Pageable page) {
        return repository.findAllByProduct(productId, page);
    }
}
