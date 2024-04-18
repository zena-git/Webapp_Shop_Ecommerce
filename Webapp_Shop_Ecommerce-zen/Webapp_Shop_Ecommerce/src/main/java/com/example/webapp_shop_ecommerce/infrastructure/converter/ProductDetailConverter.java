package com.example.webapp_shop_ecommerce.infrastructure.converter;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.entity.Color;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.entity.Size;
import com.example.webapp_shop_ecommerce.repositories.IColorRepository;
import com.example.webapp_shop_ecommerce.repositories.IMaterialRepository;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import com.example.webapp_shop_ecommerce.repositories.ISizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductDetailConverter {

    @Autowired
    IProductRepository productRepo;
    @Autowired
    ISizeRepository sizeRepo;
    @Autowired
    IColorRepository colorRepo;

    public ProductDetails convertRequestToEntity(ProductDetailsRequest request) {
        if (request.getProduct()== null || request.getSize() == null || request.getColor() == null) {
            return null;
        }
        Product product = productRepo.findById(request.getProduct()).orElse(null);
        Size size = sizeRepo.findById(request.getSize()).orElse(null);
        Color color = colorRepo.findById(request.getColor()).orElse(null);
        if (product == null || size == null || color == null) {
            return null;
        }
        return ProductDetails.builder().code(request.getCode()).imageUrl(request
                .getImageUrl()).price(request.getPrice()).quantity(request.getQuantity())
                .barcode(request.getBarcode()).status(request.getStatus())
                .product(product).color(color).size(size).weight(request.getWeight()).build();
    }


}
