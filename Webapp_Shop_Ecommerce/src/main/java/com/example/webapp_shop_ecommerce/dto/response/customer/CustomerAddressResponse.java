package com.example.webapp_shop_ecommerce.dto.response.customer;

import com.example.webapp_shop_ecommerce.dto.response.address.AddressResponse;
import lombok.*;

import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CustomerAddressResponse {

    private Long id;
    private String codeCustomer;
    private String fullName;
    private Date birthday;
    private Boolean gender;
    private String phone;
    private String email;
    private Set<AddressResponse> lstAddress;

//    private String username;
//    private String password;
}
