package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "User_roles")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@IdClass(UserRolesId.class)
public class UserRoles {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    @Id
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Roles roles;
}
