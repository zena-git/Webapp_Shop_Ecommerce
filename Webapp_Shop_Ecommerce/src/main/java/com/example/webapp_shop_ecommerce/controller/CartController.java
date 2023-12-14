package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.CartDto;
import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.ICartService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private ModelMapper mapper;
    private final IBaseService<Cart, Long> baseService;
    @Autowired
    private ICartService cartService;

    @Autowired
    public CartController(IBaseService<Cart, Long> baseService) {
        this.baseService = baseService;
    }


    @GetMapping
    public ResponseEntity<List<CartDto>> findCartAll(){
        List<CartDto> lst = new ArrayList<>();
        List<Cart> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(entity -> mapper.map(entity, CartDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveCart(@RequestBody CartDto cartDto){
        return baseService.createNew(mapper.map(cartDto, Cart.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCart( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCart(@RequestBody CartDto cartDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Cart cart = null;
        Optional<Cart> otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, cartDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            cart = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            cart = mapper.map(cartDto, Cart.class);
            cart.setId(id);
            return baseService.update(cart);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, cartDto), HttpStatus.BAD_REQUEST);


    }
    
}
