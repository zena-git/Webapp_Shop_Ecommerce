package com.example.webapp_shop_ecommerce.dto.request.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CustomerRequest {

    private Long id;
    private String codeCustomer;
    private String fullName;
    private Date birthday;
    private Boolean gender;
    private String address;
    private String phone;
    private String email;
    private String username;
    private String password;
}
