package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Color")
public class Color extends BaseEntity{
    @Column(name = "name")
    private String name;
}
