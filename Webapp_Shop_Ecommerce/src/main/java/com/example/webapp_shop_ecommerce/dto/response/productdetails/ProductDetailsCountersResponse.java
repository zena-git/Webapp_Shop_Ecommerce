package com.example.webapp_shop_ecommerce.dto.response.productdetails;

import com.example.webapp_shop_ecommerce.dto.response.color.ColorResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductClientResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotionDetails.PromotionDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotionDetails.PromotionDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.size.SizeResponse;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductDetailsCountersResponse {
    private Long id;
    private String code;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private String barcode;
    private Integer status;
    private SizeResponse size;
    private ColorResponse color;
    private Integer weight;
    private PromotionDetailsCountersResponse promotionDetailsActive;
//    private Set<PromotionDetails> lstPromotionDetails;


    private ProductCountersResponse product;

}
