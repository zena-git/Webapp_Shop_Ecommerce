package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.cartdetails.CartDetailDto;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
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
@RequestMapping("/api/v1/cartDetails")
public class CartDetailsController {

    @Autowired
    private ModelMapper mapper;
    private final IBaseService<CartDetails, Long> baseService;
    @Autowired
    private ICartDetailsService CartDetailsService;
    
    @Autowired
    public CartDetailsController(IBaseService<CartDetails, Long> baseService) {
        this.baseService = baseService;
    }


    @GetMapping
    public ResponseEntity<List<CartDetailDto>> findProductAll(){
        List<CartDetailDto> lst = new ArrayList<>();
        List<CartDetails> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(entity -> mapper.map(entity, CartDetailDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody CartDetailDto cartDetailDto){
        return baseService.createNew(mapper.map(cartDetailDto, CartDetails.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody CartDetailDto cartDetailDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        CartDetails cartDetails = null;
        Optional<CartDetails> otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, cartDetailDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            cartDetails = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            cartDetails = mapper.map(cartDetailDto, CartDetails.class);
            cartDetails.setId(id);
            return baseService.update(cartDetails);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, cartDetailDto), HttpStatus.BAD_REQUEST);


    }
    
}
