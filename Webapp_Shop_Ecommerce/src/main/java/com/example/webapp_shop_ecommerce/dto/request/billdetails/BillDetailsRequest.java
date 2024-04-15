package com.example.webapp_shop_ecommerce.dto.request.billdetails;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
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
public class BillDetailsRequest {

    private Long id;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal originalPrice;
    private BigDecimal discount;
    private Long bill;
    private String description;
    private Long productDetails;
}
