package com.example.webapp_shop_ecommerce.dto.request.productdetails;

import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.request.attributesvalues.AttributesValuesRequest;
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
public class ProductDetailsRequest {
    private Long id;
    private Long product;
    private Long attributesValues;
    private String codeProductDetail;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal listedPrice;
    private BigDecimal capitalPrice;
    private Integer quantity;
    private String barcode;
    private Integer status;

}
