package com.example.webapp_shop_ecommerce.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "PromotionDetails")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PromotionDetails extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
    @ManyToOne
    @JoinColumn(name = "product_details_id")
    private ProductDetails productDetails;
    @Column(name = "value")
    private Float value;
}
