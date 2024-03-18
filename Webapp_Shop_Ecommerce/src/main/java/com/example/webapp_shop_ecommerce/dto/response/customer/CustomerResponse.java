package com.example.webapp_shop_ecommerce.dto.response.customer;

import com.example.webapp_shop_ecommerce.dto.response.address.AddressResponse;
import com.example.webapp_shop_ecommerce.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CustomerResponse {

    private Long id;
    private String codeCustomer;
    private String fullName;
    private Date birthday;
    private Boolean gender;
    private String phone;

    private AddressResponse defaultAddress;

//    private String username;
//    private String password;
}
