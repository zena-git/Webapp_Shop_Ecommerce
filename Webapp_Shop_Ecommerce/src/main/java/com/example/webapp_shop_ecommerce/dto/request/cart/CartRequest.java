package com.example.webapp_shop_ecommerce.dto.request.cart;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class CartRequest {
    private Long id;
    private Long customer;
    private Long productDetail;
    private Integer quantity;

}
