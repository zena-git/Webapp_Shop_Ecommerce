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
    @Column(name = "code_product")
    private String code;

    @Column(name = "name")
    private String name;

    @ManyToOne()
    @JoinColumn(name = "id_category")
    private Category category;

    @ManyToOne()
    @JoinColumn(name = "id_brand")
    private Brand brand;

    @ManyToOne()
    @JoinColumn(name = "id_material")
    private Material material;

    @ManyToOne()
    @JoinColumn(name = "id_style")
    private Style style;

    @Column(name = "image_url" , length = 1000)
    private String imageUrl;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "status")
    private String status;
    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private Set<ProductDetails> lstProductDetails;
}
