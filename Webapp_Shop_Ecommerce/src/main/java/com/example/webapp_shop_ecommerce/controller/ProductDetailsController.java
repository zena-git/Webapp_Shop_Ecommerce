package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductDetailConverter;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
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
@RequestMapping("/api/v1/productDetail")
public class ProductDetailsController {
    @Autowired
    private ModelMapper mapper;
    private final IBaseService<ProductDetails, Long> baseService;
    @Autowired
    private IProductDetailsService productDetailsService;
    private ProductDetailConverter productDetailConverter;
    @Autowired
    public ProductDetailsController(IBaseService<ProductDetails, Long> baseService) {
        this.baseService = baseService;
    }

    @GetMapping
    public ResponseEntity<?> getProductDetailsAll(@RequestParam(value = "page", defaultValue = "-1") Integer page,
                                                  @RequestParam(value = "size", defaultValue = "-1") Integer size,
                                                  @RequestParam(value = "productId", defaultValue = "-1") Integer productId) {
        Pageable pageable = Pageable.unpaged();
        List<ProductDetails> lstProductDetails = new ArrayList<>();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        if (productId > 0) {
            lstProductDetails = productDetailsService.findAllByProduct(Long.valueOf(productId), pageable).getContent();
        }else {
            lstProductDetails = baseService.findAllDeletedFalse(pageable).getContent();
        }
        System.out.println(lstProductDetails);
        List<ProductDetailsRequest> resultDto = lstProductDetails.stream().map(attr -> mapper.map(attr, ProductDetailsRequest.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetailsById(@PathVariable("id") Long id) {
        Optional<ProductDetails> otp = baseService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }

        ProductDetailsResponse product = otp.map(pro -> mapper.map(pro, ProductDetailsResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        return baseService.delete(id);
    }

    @PostMapping()
    public ResponseEntity<?> save(@RequestBody ProductDetailsRequest productDetailsRequest) {
        ProductDetails productDetails = productDetailConverter.convertRequestToEntity(productDetailsRequest);

//        return baseService.createNew(productDetails);
        return  new ResponseEntity<>(productDetails, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody ProductDetailsRequest productDetailsDto) {
        Optional<ProductDetails> otp = baseService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm thấy id", 1, productDetailsDto), HttpStatus.BAD_REQUEST);
        }
        ProductDetails productDetails = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
        productDetails = mapper.map(productDetailsDto, ProductDetails.class);
        productDetails.setId(id);
        System.out.println(productDetails.toString());
        return baseService.update(productDetails);
    }
}
