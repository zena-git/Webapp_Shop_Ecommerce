package com.example.webapp_shop_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "Product")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Product extends BaseEntity{

    @Column(name = "name")
    private String name;
    @ManyToOne()
    @JoinColumn(name = "id_category")
    private Category category;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "description")
    private String description;
    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private Set<ProductDetails> lstProductDetails;
}
