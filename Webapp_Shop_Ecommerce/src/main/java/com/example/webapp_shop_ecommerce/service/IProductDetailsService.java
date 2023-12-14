package com.example.webapp_shop_ecommerce.service;

import com.example.backend_web_truong_huong.entity.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductDetailsService {
    Page<ProductDetails> findAllByProduct(Long productId, Pageable page);
}
