package com.example.webapp_shop_ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class CartDetailDto {
    private Long id;
    private CartDto cart;
    private ProductDetailsDto productDetails;
}
