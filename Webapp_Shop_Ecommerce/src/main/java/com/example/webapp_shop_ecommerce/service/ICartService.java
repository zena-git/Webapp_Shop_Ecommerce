package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Cart;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ICartService extends IBaseService<Cart, Long> {

    ResponseEntity<ResponseObject> addToCart(CartRequest cartRequest);

    Cart findCartClient();
}
