package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsDto;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/productDetail")
public class ProductDetailsController {
    @Autowired
    private ModelMapper mapper;
    private final IBaseService<ProductDetails, Long> baseService;
    @Autowired
    private IProductDetailsService productDetailsService;

    @Autowired
    public ProductDetailsController(IBaseService<ProductDetails, Long> baseService) {
        this.baseService = baseService;
    }

    @GetMapping("/details")
    public ResponseEntity<List<ProductDetailsDto>> getProductDetailsAllByProduct(@RequestParam(value = "productId", defaultValue = "0") Long id) {
        // Logic to get product details by product ID
        List<ProductDetails> lstProductDetails = productDetailsService.findAllByProduct(id,Pageable.unpaged()).getContent();

        List<ProductDetailsDto> resultDto = lstProductDetails.stream()
                .map(attr -> mapper.map(attr, ProductDetailsDto.class))
                .collect(Collectors.toList());

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ProductDetailsDto>> getProductDetailsAll(){

        List<ProductDetails> lstProductDetails =  baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        System.out.println(lstProductDetails);
        List<ProductDetailsDto> resultDto = lstProductDetails.stream().map(attr -> mapper.map(attr, ProductDetailsDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable("id") Long id){
        return baseService.delete(id);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> save(@RequestBody ProductDetailsDto productDetailsDto){
        ProductDetails productDetails = mapper.map(productDetailsDto, ProductDetails.class);
        return baseService.createNew(productDetails);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable("id") Long id, @RequestBody ProductDetailsDto productDetailsDto){
        Optional<ProductDetails> otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm thấy id", 1, productDetailsDto), HttpStatus.BAD_REQUEST);
        }

        ProductDetails productDetails  = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
        productDetails  = mapper.map(productDetailsDto, ProductDetails.class);
        productDetails.setId(id);
        System.out.println(productDetails.toString());
        return baseService.update(productDetails);
    }
}
