package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.cart.CartResponse;
import com.example.webapp_shop_ecommerce.dto.response.historybill.HistoryBillResponse;
import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.service.ICartService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ICartService cartService;

    @GetMapping
    public ResponseEntity<?> findCartAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        System.out.println("page=" + page + " size=" + size);
        List<Cart> lstPro = cartService.findAllDeletedFalse(pageable).getContent();
        List<CartResponse> resultDto = lstPro.stream().map(entity -> mapper.map(entity, CartResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Cart> otp = cartService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        CartResponse cart = otp.map(pro -> mapper.map(pro, CartResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveCart(@RequestBody CartRequest cartDto){
        return cartService.createNew(mapper.map(cartDto, Cart.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCart( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return cartService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCart(@RequestBody CartRequest cartDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Cart cart = null;
        Optional<Cart> otp = cartService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, cartDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            cart = cartService.findById(id).orElseThrow(IllegalArgumentException::new);
            cart = mapper.map(cartDto, Cart.class);
            cart.setId(id);
            return cartService.update(cart);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, cartDto), HttpStatus.BAD_REQUEST);


    }
    
}
