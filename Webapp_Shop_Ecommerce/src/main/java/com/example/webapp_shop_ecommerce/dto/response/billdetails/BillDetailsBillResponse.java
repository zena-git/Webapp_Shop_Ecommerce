package com.example.webapp_shop_ecommerce.dto.response.billdetails;

import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsBillResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BillDetailsBillResponse {

    private Long id;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String status;
    private ProductDetailsBillResponse productDetails;
}
