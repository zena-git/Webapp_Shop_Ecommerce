package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IProductService;
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
@RequestMapping("/api/v1/product")
public class ProductController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IProductService productService;
    
    @GetMapping
    public ResponseEntity<?> findProductAll(@RequestParam(value = "page", defaultValue = "-1") Integer page,
                                            @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        System.out.println("page=" + page + " size=" + size);
        List<Product> lstPro = productService.findAllDeletedFalse(pageable).getContent();
        List<ProductResponse> resultDto  = lstPro.stream().map(pro -> mapper.map(pro, ProductResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findProductById(@PathVariable("id") Long id) {
        Optional<Product> otp = productService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        ProductResponse product = otp.map(pro -> mapper.map(pro, ProductResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(@RequestParam(value = "name") String name) {
        List<Product> lstPro = productService.findProductByName(name.trim());
        return new ResponseEntity<>(lstPro.stream().map(pro -> mapper.map(pro, ProductRequest.class)).collect(Collectors.toList()), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> saveProduct(@RequestBody ProductRequest productDto) {
        Optional<Product> otp = productService.findByName(productDto.getName());
        if (otp.isPresent()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, productDto), HttpStatus.BAD_REQUEST);
        }
        return productService.createNew(mapper.map(productDto, Product.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long id) {
        System.out.println("Delete ID: " + id);
        return productService.delete(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductRequest productDto, @PathVariable("id") Long id) {
        System.out.println("Update ID: " + id);
        Optional<Product> otp = productService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, productDto), HttpStatus.BAD_REQUEST);
        }

        if (productService.findByName(productDto.getName()).isPresent()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, productDto), HttpStatus.BAD_REQUEST);
        }
        Product product = otp.orElseThrow(IllegalArgumentException::new);
        product = mapper.map(productDto, Product.class);
        product.setId(id);
        return productService.update(product);
    }
}
