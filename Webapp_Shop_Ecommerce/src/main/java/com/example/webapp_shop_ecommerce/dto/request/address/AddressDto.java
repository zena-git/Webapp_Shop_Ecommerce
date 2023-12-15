package com.example.webapp_shop_ecommerce.dto.request.address;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class AddressDto {
    private Long id;
    private String name;
    private CustomerDto customer;
}
