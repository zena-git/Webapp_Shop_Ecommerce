package com.example.webapp_shop_ecommerce.dto.response.cart;

import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class CartResponse {
    private Long id;
    private CustomerResponse customer;
}
