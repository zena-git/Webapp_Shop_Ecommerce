package com.example.webapp_shop_ecommerce.entity;

import com.example.webapp_shop_ecommerce.infrastructure.enums.Roles;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Users")
public class Users extends BaseEntity {
    @Column(name = "code_user")
    private String codeUser;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "image_url", length = 1000)
    private String imageUrl;
    @Column(name = "birthday")
    private Date birthday;
    @Column(name = "users_role")
    @Enumerated(EnumType.STRING)
    private Roles usersRole;
    @Column(name = "gender")
    private Boolean gender;
    @Column(name = "detail")
    private String detail;
    @Column(name = "commune")
    private String commune;
    @Column(name = "district")
    private String district;
    @Column(name = "province")
    private String province;
    @Column(name = "email")
    private String email;
    @Column(name = "phone")
    private String phone;
    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;

    public Users() {
        this.usersRole = Roles.STAFF;
    }
}
