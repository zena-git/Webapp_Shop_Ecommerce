package com.example.webapp_shop_ecommerce.dto.request.products;

import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
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
public class ProductDto {
    private Long id;
    private String imageUrl;
    private String name;
    private Category category;
    private String description;
    private String createdBy;
    private LocalDateTime createdDate;
    private Set<ProductDetails> lstProductDetails;

}
