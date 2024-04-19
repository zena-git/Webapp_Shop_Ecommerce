package com.example.webapp_shop_ecommerce.dto.response.cart;

import com.example.webapp_shop_ecommerce.dto.response.cartdetails.CartDetailResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class CartResponse {
    private Long id;
    private CustomerResponse customer;
    private Set<CartDetailResponse> lstCartDetails;
}
