package com.example.webapp_shop_ecommerce.dto.response.promotionDetails;

import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsSupportResponse;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class PromotionDetailsSupportResponse {
    private Long id;
//    private PromotionResponse promotion;
    private Float promotionValue;
    private ProductDetailsSupportResponse productDetails;
    private Boolean deleted;
}
