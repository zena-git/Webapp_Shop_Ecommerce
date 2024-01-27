package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Cart")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Cart extends BaseEntity{

    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
