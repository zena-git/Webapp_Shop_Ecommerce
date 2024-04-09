package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsClientResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThai;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.service.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/product")
public class ProductClientController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IProductService productService;
    @Autowired
    private IProductDetailsService productDetailsService;
    @GetMapping
    public ResponseEntity<?> findProductAll(@RequestParam(value = "page", defaultValue = "-1") Integer page,
                                            @RequestParam(value = "size", defaultValue = "-1") Integer size,
                                            @RequestParam(value = "search", defaultValue = "") String search,
                                            @RequestParam(value = "category", defaultValue = "") String category,
                                            @RequestParam(value = "material", defaultValue = "") String material,
                                            @RequestParam(value = "brand", defaultValue = "") String brand,
                                            @RequestParam(value = "style", defaultValue = "") String style

    ) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }


        //Dong goi praram
        Map<String, String> keyWork = new HashMap<String, String>();
        keyWork.put("search", search.trim());
        keyWork.put("category", category.trim());
        keyWork.put("material", material.trim());
        keyWork.put("brand", brand.trim());
        keyWork.put("style", style.trim());
        keyWork.put("status", TrangThai.HOAT_DONG.getLabel());



        System.out.println("page=" + page + " size=" + size + "search=" + keyWork.get("search"));
        List<Product> lstPro = productService.findProductsClientAndDetailsNotDeleted(pageable, keyWork).getContent();
        List<ProductResponse> resultDto  = lstPro.stream().map(pro -> mapper.map(pro, ProductResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findProductById(@PathVariable("id") Long id) {
        Optional<Product> otp = productService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        List<ProductDetails> lstProductDetails = productDetailsService.findAllClientDeletedFalseAndStatusFalse(Long.valueOf(id), Pageable.unpaged()).getContent();
        List<ProductDetailsClientResponse> resultDto = lstProductDetails.stream().map(attr -> mapper.map(attr, ProductDetailsClientResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
