package com.example.webapp_shop_ecommerce.dto.request.customer;

import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.entity.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "Không được để trống tên ")
    @Size(max = 200, message = "Tên quá dài. Hãy nhập tên ngắn hơn.")
    private String fullName;
    private Date birthday;
    private Boolean gender;
    @NotBlank(message = "Không được để trống sđt ")
    @Size(max = 20, message = "Sđt quá dài. Hãy nhập sđt ngắn hơn.")
    private String phone;
    @NotBlank(message = "Không được để trống email")
    @Size(max = 100, message = "Emailquá dài. Hãy nhập email ngắn hơn.")
    private String email;
    private Set<AddressRequest> lstAddress;
}
