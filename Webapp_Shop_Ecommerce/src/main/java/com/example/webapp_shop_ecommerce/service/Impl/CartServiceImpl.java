package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.repositories.ICartRepository;
import com.example.webapp_shop_ecommerce.service.ICartService;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl extends BaseServiceImpl<Cart, Long, ICartRepository> implements ICartService {
}
