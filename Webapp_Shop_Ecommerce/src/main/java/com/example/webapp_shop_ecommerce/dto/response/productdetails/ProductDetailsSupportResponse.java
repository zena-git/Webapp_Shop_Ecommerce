package com.example.webapp_shop_ecommerce.dto.response.productdetails;

import com.example.webapp_shop_ecommerce.dto.response.color.ColorResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductSupportResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotionDetails.PromotionDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.size.SizeResponse;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductDetailsSupportResponse {
    private Long id;
    private String code;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private String barcode;
    private String status;
    private SizeResponse size;
    private ColorResponse color;
    private  Integer weight;

    private ProductSupportResponse product;
//    private PromotionDetailsCountersResponse promotionDetailsActive;


//    private ProductResponse product;

}
