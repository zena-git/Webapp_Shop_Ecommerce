package com.example.webapp_shop_ecommerce.dto.request.productdetails;

import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.request.attributesvalues.AttributesValuesRequest;
import com.example.webapp_shop_ecommerce.entity.AttributesValues;
import com.example.webapp_shop_ecommerce.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private String code;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private String barcode;
    private Integer status;
    private Long product;
    private Long attributesValues;

}
