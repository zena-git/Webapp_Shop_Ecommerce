package com.example.webapp_shop_ecommerce.dto.request.address;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.entity.Customer;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class AddressRequest {
    private Long id;
    private String receiverName;
    private String receiverPhone;
    private String detail;
    private String commune;
    private String district;
    private String province;
    private Long customer;
    private boolean defaultAddress;
}