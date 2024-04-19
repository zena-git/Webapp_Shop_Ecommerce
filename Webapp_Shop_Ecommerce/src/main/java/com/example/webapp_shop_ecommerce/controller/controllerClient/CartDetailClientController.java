package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.request.cartdetails.CartDetailRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v2/cartDetails")
public class CartDetailClientController {
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ICartDetailsService cartDetailsService;

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return cartDetailsService.physicalDelete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateQuantity(@RequestBody CartDetailRequest cartDetailDto, @PathVariable("id") Long id){

            cartDetailsService.updateQuantity(cartDetailDto.getQuantity(), id);
            return new ResponseEntity<>(new ResponseObject("success", "Update OK", 1, cartDetailDto), HttpStatus.CREATED);




    }
}
