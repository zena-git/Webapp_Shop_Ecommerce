package com.example.webapp_shop_ecommerce.dto.response.promotionDetails;

import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionResponse;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class PromotionDetailsResponse {
    private Long id;
//    private PromotionResponse promotion;
    private Float promotionValue;

//    private ProductDetailsResponse productDetails;
}
