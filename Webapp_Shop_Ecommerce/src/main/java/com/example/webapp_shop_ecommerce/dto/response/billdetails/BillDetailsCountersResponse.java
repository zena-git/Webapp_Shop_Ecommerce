package com.example.webapp_shop_ecommerce.dto.response.billdetails;

import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BillDetailsCountersResponse {

    private Long id;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
//    private BillResponse bill;
    private ProductDetailsCountersResponse productDetails;
}
