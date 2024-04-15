package com.example.webapp_shop_ecommerce.dto.response.promotionDetails;

import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class PromotionDetailsCountersResponse {
    private Long id;
    private PromotionCountersResponse promotion;
    private Float promotionValue;

//    private ProductDetailsResponse productDetails;
}
