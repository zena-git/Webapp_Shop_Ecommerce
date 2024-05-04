package com.example.webapp_shop_ecommerce.dto.response.cartdetails;

import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsClientResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
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
//    private Long cart;
    private ProductDetailsClientResponse productDetails;
    private Integer quantity;

}
