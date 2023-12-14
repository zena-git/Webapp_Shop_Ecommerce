package com.example.webapp_shop_ecommerce.dto;

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
public class ProductDetailsDto {
    private Long id;
    private String codeProductDetail;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal listedPrice;
    private BigDecimal capitalPrice;
    private Integer quantity;
    private String barcode;
    private Integer status;
    private ProductDto product;
    private AttributesValuesDto attributesValues;

}
