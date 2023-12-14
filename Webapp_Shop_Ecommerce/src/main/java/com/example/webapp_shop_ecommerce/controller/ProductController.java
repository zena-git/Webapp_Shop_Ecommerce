package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.ProductDto;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.IProductService;
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
@RequestMapping("/api/v1/product")
public class ProductController {

    @Autowired
    private ModelMapper mapper;
    private final IBaseService<Product, Long> baseService;
    @Autowired
    private IProductService productService;
    @Autowired
    public ProductController(IBaseService<Product, Long> baseService) {
        this.baseService = baseService;
    }
    @GetMapping
    public ResponseEntity<List<ProductDto>> findProductAll(){
        List<ProductDto> lst = new ArrayList<>();
        List<Product> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(pro -> mapper.map(pro, ProductDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> findProductAllObj(@PathVariable Long id){
        Product pro = productService.findByProductDetailByIdProduct(id).get();
        pro.setLstProductDetails(pro.getLstProductDetails());
        ProductDto productDto = mapper.map(pro, ProductDto.class);
        return new ResponseEntity<>(new ResponseObject("Success", "ok", 0, productDto), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody ProductDto productDto){
        Optional<Product> otp = productService.findByName(productDto.getName());
        if (otp.isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, productDto), HttpStatus.BAD_REQUEST);
        }

//        Optional<Product> otp2 = productService.findByCodeProduct(productDto.getCodeProduct());
//        if (otp2.isPresent()){
//            return new ResponseEntity<>(new ResponseObject("Fail", "Code sản phẩm đã tồn tại", 1, productDto), HttpStatus.BAD_REQUEST);
//        }
        return baseService.createNew(mapper.map(productDto, Product.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody ProductDto productDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Product product = null;
        Optional<Product>  otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, productDto), HttpStatus.BAD_REQUEST);
        }

        if (productService.findByName(productDto.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, productDto), HttpStatus.BAD_REQUEST);
        }
        if (otp.isPresent()){
            product = otp.get();
            product = mapper.map(productDto, Product.class);
//            product.setCodeProduct(otp.get().getCodeProduct());
            return baseService.update(product);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, productDto), HttpStatus.BAD_REQUEST);


    }
}
