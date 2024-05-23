package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.CartDetails;
import com.example.webapp_shop_ecommerce.repositories.ICartDetailsRepository;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
import org.springframework.stereotype.Service;

@Service
public class CartDetailsServiceImpl extends BaseServiceImpl<CartDetails, Long, ICartDetailsRepository> implements ICartDetailsService {
    @Override
    public void updateQuantity(Integer quantity, Long id) {
        repository.updateQuantity(quantity, id);
    }
}
