package com.example.webapp_shop_ecommerce.dto.request.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
}
