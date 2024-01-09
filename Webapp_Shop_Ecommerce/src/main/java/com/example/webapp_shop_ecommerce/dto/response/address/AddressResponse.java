package com.example.webapp_shop_ecommerce.dto.response.address;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class AddressResponse {
    private Long id;
    private Long customer;
    private String name;
}
