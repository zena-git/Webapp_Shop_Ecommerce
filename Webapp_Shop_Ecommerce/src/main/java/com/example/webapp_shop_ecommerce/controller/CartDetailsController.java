package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.cartdetails.CartDetailRequest;
import com.example.webapp_shop_ecommerce.dto.response.cartdetails.CartDetailResponse;
import com.example.webapp_shop_ecommerce.dto.response.historybill.HistoryBillResponse;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
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

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/cartDetails")
public class CartDetailsController {

    @Autowired
    private ModelMapper mapper;
  
    @Autowired
    private ICartDetailsService cartDetailsService;


    @GetMapping
    public ResponseEntity<?> findProductAll(
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
        List<CartDetails> lstPro = cartDetailsService.findAllDeletedFalse(pageable).getContent();
        List<CartDetailResponse>  resultDto = lstPro.stream().map(entity -> mapper.map(entity, CartDetailResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<CartDetails> otp = cartDetailsService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        CartDetailResponse cartDetails = otp.map(pro -> mapper.map(pro, CartDetailResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(cartDetails, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody CartDetailRequest cartDetailDto){
        return cartDetailsService.createNew(mapper.map(cartDetailDto, CartDetails.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return cartDetailsService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody CartDetailRequest cartDetailDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        CartDetails cartDetails = null;
        Optional<CartDetails> otp = cartDetailsService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, cartDetailDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            cartDetails = cartDetailsService.findById(id).orElseThrow(IllegalArgumentException::new);
            cartDetails = mapper.map(cartDetailDto, CartDetails.class);
            cartDetails.setId(id);
            return cartDetailsService.update(cartDetails);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, cartDetailDto), HttpStatus.BAD_REQUEST);


    }
    
}
