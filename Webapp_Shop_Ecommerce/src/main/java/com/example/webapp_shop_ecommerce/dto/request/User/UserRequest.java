package com.example.webapp_shop_ecommerce.dto.request.User;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserRequest {
    private Long id;
    private String codeUser;
    private String fullName;
    private String imageUrl;
    private Date birthday;
    private Boolean gender;
    private String detail;
    private String commune;
    private String district;
    private String province;
    private String email;
    private String phone;
    private String username;
}
