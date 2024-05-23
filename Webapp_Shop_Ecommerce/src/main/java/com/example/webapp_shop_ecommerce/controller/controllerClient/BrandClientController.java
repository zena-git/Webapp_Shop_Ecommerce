package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.request.brand.BrandRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.brand.BrandResponse;
import com.example.webapp_shop_ecommerce.entity.Brand;
import com.example.webapp_shop_ecommerce.service.Impl.BrandServiceImpl;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/brand")
public class BrandClientController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private BrandServiceImpl brandService;



    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        List<Brand> brand = brandService.findAllDeletedFalse(pageable).getContent();
        List<BrandResponse> result = brand.stream().map(attr -> mapper.map(attr, BrandResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
