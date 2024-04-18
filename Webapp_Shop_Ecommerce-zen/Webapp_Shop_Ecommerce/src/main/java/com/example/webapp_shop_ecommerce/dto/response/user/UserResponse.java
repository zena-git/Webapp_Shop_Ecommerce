package com.example.webapp_shop_ecommerce.dto.response.user;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class UserResponse {
    private Long id;
    private String codeUser;
    private String fullName;
    private Date birthday;
    private Boolean gender;
    private String address;
    private String email;
    private String phone;
    private String imageUrl;
    private String detail;
    private String commune;
    private String district;
    private String province;
    private String username;

}
