package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Address")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Address extends BaseEntity{
    @Column(name = "name")
    private String name;
    @ManyToOne()
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
