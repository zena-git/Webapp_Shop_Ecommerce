package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.CartDetails;

public interface ICartDetailsService extends IBaseService<CartDetails, Long>{
    void updateQuantity(Integer quantity,Long id);

}
