package com.example.webapp_shop_ecommerce.dto.response.products;

import com.example.webapp_shop_ecommerce.dto.response.brand.BrandResponse;
import com.example.webapp_shop_ecommerce.dto.response.categories.CategoryResponse;
import com.example.webapp_shop_ecommerce.dto.response.material.MaterialResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.style.StyleResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductClientResponse {
    private Long id;
    private String code;
    private String imageUrl;
    private String name;
    private CategoryResponse category;
    private BrandResponse brand;
    private MaterialResponse material;
    private StyleResponse style;
    private String description;
    private String status;
    private String createdBy;
    private LocalDateTime createdDate;


//    private Set<ProductDetailsResponse> lstProductDetails;


}
