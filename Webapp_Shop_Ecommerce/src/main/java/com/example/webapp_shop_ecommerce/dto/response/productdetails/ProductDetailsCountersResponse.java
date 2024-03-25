package com.example.webapp_shop_ecommerce.dto.response.productdetails;

import com.example.webapp_shop_ecommerce.dto.response.color.ColorResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductClientResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.size.SizeResponse;
import lombok.*;

import java.math.BigDecimal;

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
    private  Float weight;

    private ProductCountersResponse product;

}
