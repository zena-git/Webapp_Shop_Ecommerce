package com.example.webapp_shop_ecommerce.dto.response.products;

import com.example.webapp_shop_ecommerce.dto.response.categories.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductResponse {
    private Long id;
    private String imageUrl;
    private String name;
    private CategoryResponse category;
    private String description;

}
