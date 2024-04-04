package com.example.webapp_shop_ecommerce.dto.response.productdetails;

import com.example.webapp_shop_ecommerce.dto.response.attributesvalues.AttributesValuesResponse;
import com.example.webapp_shop_ecommerce.dto.response.color.ColorResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.size.SizeResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductDetailsResponse {
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


//    private ProductResponse product;

}
