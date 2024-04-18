package com.example.webapp_shop_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "ProductDetail")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductDetails extends BaseEntity{
    @Column(name = "code_product_detail")
    private String code;

    @ManyToOne()
    @JoinColumn(name = "color_id")
    private Color color;

    @ManyToOne()
    @JoinColumn(name = "size_id")
    private Size size;

    @ManyToOne()
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "image_url" , length = 1000)
    private String imageUrl;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "weight")
    private  Integer weight;
    @Column(name = "barcode")
    private String barcode;

    @Column(name = "status")
    private String status;
    @JsonIgnore
    @OneToMany(mappedBy = "productDetails")
    private Set<PromotionDetails> lstPromotionDetails;

    @ManyToOne
    @JoinColumn(name = "ative_promotion_detail_id")
    @JsonIgnore
    private PromotionDetails promotionDetailsActive;

}
