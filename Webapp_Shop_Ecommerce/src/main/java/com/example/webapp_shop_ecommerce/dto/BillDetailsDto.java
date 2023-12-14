package com.example.webapp_shop_ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BillDetailsDto {

    private Long id;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private BillDto bill;
    private ProductDetailsDto productDetails;
}
