package com.example.webapp_shop_ecommerce.infrastructure.converter;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.entity.AttributesValues;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.repositories.IAttributesValuesRepository;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductDetailConverter {
    @Autowired
    IAttributesValuesRepository attributesValuesRepo;
    @Autowired
    IProductRepository productRepo;

    public ProductDetails convertRequestToEntity(ProductDetailsRequest request) {
        AttributesValues attributesValues = attributesValuesRepo.findById(request.getAttributesValues()).orElse(null);
        Product product = productRepo.findById(request.getProduct()).orElse(null);
        return ProductDetails.builder().code(request.getCode()).imageUrl(request
                .getImageUrl()).price(request.getPrice()).quantity(request.getQuantity())
                .barcode(request.getBarcode()).status(request.getStatus())
                .product(product).attributesValues(attributesValues).build();
    }


}
