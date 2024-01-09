package com.example.webapp_shop_ecommerce.dto.response.cartdetails;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class CartDetailResponse {
    private Long id;
    private Long cart;
    private Long productDetails;
}
