package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.cart.CartResponse;
import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.service.ICartService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/cart")
public class CartClientController {
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ICartService cartService;
    @GetMapping
    public ResponseEntity<?> findCart() {

        Cart cart = cartService.findCartClient();
        CartResponse cartRepon =  mapper.map(cart, CartResponse.class);
        return new ResponseEntity<>(cartRepon, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveCart(@RequestBody CartRequest cartDto){
        System.out.println(cartDto);
        return cartService.addToCart(cartDto);
    }
}
