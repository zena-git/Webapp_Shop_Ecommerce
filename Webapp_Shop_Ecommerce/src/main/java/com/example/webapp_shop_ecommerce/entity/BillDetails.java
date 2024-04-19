package com.example.webapp_shop_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "BillDetails")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BillDetails extends BaseEntity{
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    @Column(name = "original_price")
    private BigDecimal originalPrice;
    @Column(name = "discount")
    private BigDecimal discount;
    @Column(name = "status")
    private String status;
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;
    @ManyToOne
    @JoinColumn(name = "product_detail_id")
    private ProductDetails productDetails;

    @ManyToOne
    @JoinColumn(name = "ative_promotion_detail_id")
    @JsonIgnore
    private PromotionDetails promotionDetailsActive;
}
