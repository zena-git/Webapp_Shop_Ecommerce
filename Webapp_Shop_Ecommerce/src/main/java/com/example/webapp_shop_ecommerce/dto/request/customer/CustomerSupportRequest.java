package com.example.webapp_shop_ecommerce.dto.request.customer;

import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.entity.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CustomerSupportRequest {

    private Long id;
    private String codeCustomer;
    private String fullName;
    private Date birthday;
    private Boolean gender;
    private String phone;
    private String email;
    @Valid
    @Size(min = 1, message = "Ít nhất phải có một địa chỉ khách hàng")
    private Set<AddressRequest> lstAddress;
}
