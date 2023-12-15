package com.example.webapp_shop_ecommerce.dto.request.cart;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class CartDto {
    private Long id;
    private CustomerDto customer;
}
