package com.example.webapp_shop_ecommerce.infrastructure.converter;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProductConverter {
    @Autowired
    IProductRepository productRepo;
    @Autowired
    ISizeRepository sizeRepo;
    @Autowired
    IColorRepository colorRepo;
    @Autowired
    IBrandRepository brandRepo;
    @Autowired
    IMaterialRepository materialRepo;
    @Autowired
    IStyleRepository styleRepo;
    @Autowired
    ICategoryRepository categoryRepo;
    @Autowired
    IProductDetailsRepository productDetailsRepo;

    public Product convertRequestToEntity(ProductRequest request){
        if (request.getCategory() == null || request.getBrand() == null || request.getMaterial() == null ||
            request.getStyle() == null || request.getLstProductDetails() == null){
            return null;
        }
        Category category = categoryRepo.findById(request.getCategory()).orElse(null);
        Brand brand = brandRepo.findById(request.getBrand()).orElse(null);
        Material material = materialRepo.findById(request.getMaterial()).orElse(null);
        Style style = styleRepo.findById(request.getStyle()).orElse(null);

     return Product.builder()
             .brand(brand)
             .category(category)
             .material(material)
             .style(style)
             .imageUrl(request.getImageUrl().trim())
             .name(request.getName().trim())
             .description(request.getDescription().trim())
             .code(request.getCode().trim())
             .build();
    }
}
